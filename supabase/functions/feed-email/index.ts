type InboundEvent = {
  type: string;
  data?: { email_id?: string };
};

type ReceivedEmail = {
  id: string;
  from: string;
  to?: string[];
  received_for?: string[];
  subject?: string;
  text?: string | null;
  html?: string | null;
  authentication?: { spf?: string; dkim?: string; dmarc?: string } | null;
};

type Attachment = {
  id: string;
  content_type: string;
  size: number;
  download_url: string;
};

type EdgeRuntime = {
  serve: (handler: (request: Request) => Response | Promise<Response>) => void;
  env: { get: (name: string) => string | undefined };
};

const runtime = (globalThis as typeof globalThis & { Deno: EdgeRuntime }).Deno;
const encoder = new TextEncoder();
const imageTypes: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function fromAddress(value: string) {
  return (value.match(/<([^>]+)>/)?.[1] ?? value).trim().toLowerCase();
}

function decodeBase64(value: string) {
  const decoded = atob(value);
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}

async function verifyWebhook(request: Request, payload: string, secret: string) {
  const id = request.headers.get('svix-id');
  const timestamp = request.headers.get('svix-timestamp');
  const signatures = request.headers.get('svix-signature');
  const timestampSeconds = Number(timestamp);
  if (!id || !timestamp || !signatures || !Number.isFinite(timestampSeconds) || Math.abs(Date.now() / 1000 - timestampSeconds) > 300) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    decodeBase64(secret.replace(/^whsec_/, '')),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const signedPayload = encoder.encode(`${id}.${timestamp}.${payload}`);

  for (const signature of signatures.split(' ')) {
    const [version, value] = signature.split(',', 2);
    if (version === 'v1' && value && await crypto.subtle.verify('HMAC', key, decodeBase64(value), signedPayload)) return true;
  }
  return false;
}

function plainText(email: ReceivedEmail) {
  const text = email.text?.trim();
  if (text) return text;

  return (email.html ?? '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/p\s*>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .trim();
}

async function receivedEmail(emailId: string, apiKey: string): Promise<ReceivedEmail> {
  const response = await fetch(`https://api.resend.com/emails/receiving/${encodeURIComponent(emailId)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!response.ok) throw new Error(`Resend email fetch failed: ${response.status}`);
  return await response.json() as ReceivedEmail;
}

async function firstImage(emailId: string, apiKey: string): Promise<{ bytes: Uint8Array; type: string; extension: string } | null> {
  const response = await fetch(`https://api.resend.com/emails/receiving/${encodeURIComponent(emailId)}/attachments`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!response.ok) throw new Error(`Resend attachment list failed: ${response.status}`);

  const result = await response.json() as { data?: Attachment[] };
  const attachment = result.data?.find((item) => imageTypes[item.content_type]);
  if (!attachment) return null;
  if (attachment.size > 8 * 1024 * 1024) throw new Error('Feed image exceeds the 8 MB limit');

  const imageResponse = await fetch(attachment.download_url);
  if (!imageResponse.ok) throw new Error(`Resend attachment download failed: ${imageResponse.status}`);
  return {
    bytes: new Uint8Array(await imageResponse.arrayBuffer()),
    type: attachment.content_type,
    extension: imageTypes[attachment.content_type],
  };
}

async function saveImage(emailId: string, image: { bytes: Uint8Array; type: string; extension: string }, supabaseUrl: string, serviceKey: string) {
  const fileName = `${emailId}.${image.extension}`;
  const response = await fetch(`${supabaseUrl}/storage/v1/object/feed/email/${fileName}`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': image.type,
      'x-upsert': 'true',
    },
    body: image.bytes.slice().buffer as ArrayBuffer,
  });
  if (!response.ok) throw new Error(`Supabase image upload failed: ${response.status}`);
  return `${supabaseUrl}/storage/v1/object/public/feed/email/${fileName}`;
}

runtime.serve(async (request) => {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed' });

  const signingSecret = runtime.env.get('RESEND_WEBHOOK_SECRET');
  const resendApiKey = runtime.env.get('RESEND_API_KEY');
  const allowedSender = runtime.env.get('FEED_ALLOWED_SENDER')?.toLowerCase();
  const inboxAddress = runtime.env.get('FEED_INBOX_ADDRESS')?.toLowerCase();
  const supabaseUrl = runtime.env.get('SUPABASE_URL')?.replace(/\/$/, '');
  const serviceKey = runtime.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!signingSecret || !resendApiKey || !allowedSender || !inboxAddress || !supabaseUrl || !serviceKey) {
    return json(500, { error: 'Feed email is not configured' });
  }

  const payload = await request.text();
  if (!await verifyWebhook(request, payload, signingSecret)) return json(401, { error: 'Invalid webhook signature' });

  const event = JSON.parse(payload) as InboundEvent;
  if (event.type !== 'email.received') return json(200, { ignored: true });
  const emailId = event.data?.email_id;
  if (!emailId || !/^[\da-f-]{36}$/i.test(emailId)) return json(400, { error: 'Invalid received email ID' });

  const email = await receivedEmail(emailId, resendApiKey);
  const recipients = [...(email.to ?? []), ...(email.received_for ?? [])].map((recipient) => recipient.toLowerCase());
  const authenticated = email.authentication?.spf === 'pass' || email.authentication?.dkim === 'pass';
  if (fromAddress(email.from) !== allowedSender || !recipients.includes(inboxAddress) || !authenticated) {
    return json(200, { ignored: true });
  }

  const image = await firstImage(emailId, resendApiKey);
  const mediaUrl = image ? await saveImage(emailId, image, supabaseUrl, serviceKey) : null;
  const content = plainText(email) || email.subject?.trim() || (mediaUrl ? 'Photo shared by Jose.' : '');
  if (!content && !mediaUrl) return json(200, { ignored: true });

  const response = await fetch(`${supabaseUrl}/rest/v1/posts?on_conflict=source_event_id`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify({
      type: mediaUrl ? 'photo' : 'thought',
      content,
      media_url: mediaUrl,
      source_event_id: emailId,
    }),
  });
  if (!response.ok) throw new Error(`Supabase post insert failed: ${response.status}`);
  return json(200, { published: true });
});
