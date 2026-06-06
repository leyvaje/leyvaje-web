import 'dotenv/config';
import { Client, GatewayIntentBits, Events } from 'discord.js';
import { createClient } from '@supabase/supabase-js';

// ── Clients ────────────────────────────────────────────────────
const discord  = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY   // service role key — never expose in frontend
);

// ── Channel the bot watches ────────────────────────────────────
// Set CHANNEL_ID in .env — right-click your channel in Discord → Copy ID
const WATCHED_CHANNEL = process.env.DISCORD_CHANNEL_ID;

// ── Detect post type from message ─────────────────────────────
function detectType(msg) {
  const text    = msg.content.trim();
  const attach  = msg.attachments.first();

  if (attach) {
    const mime = attach.contentType || '';
    if (mime.startsWith('image/'))  return 'photo';
    if (mime.startsWith('audio/') || mime.startsWith('video/')) return 'music';
  }

  // URL-only → link
  const urlRe = /^https?:\/\/\S+$/;
  if (urlRe.test(text)) return 'link';

  return 'thought';
}

// ── Extract content per type ───────────────────────────────────
function extractContent(msg, type) {
  const text   = msg.content.trim();
  const attach = msg.attachments.first();

  switch (type) {
    case 'photo':
      return {
        content:   text || null,           // optional caption
        media_url: attach?.url ?? null,
      };
    case 'music':
      return {
        content:   text || null,           // optional title/note
        media_url: attach?.url ?? null,
      };
    case 'link':
      return {
        content:   text,
        media_url: null,
      };
    case 'thought':
    default:
      return {
        content:   text,
        media_url: null,
      };
  }
}

// ── Handle incoming message ────────────────────────────────────
discord.on(Events.MessageCreate, async (msg) => {
  // Ignore bots and wrong channel
  if (msg.author.bot) return;
  if (msg.channelId !== WATCHED_CHANNEL) return;

  // Ignore messages that start with -- (drafts/notes)
  if (msg.content.startsWith('--')) return;

  const type = detectType(msg);
  const { content, media_url } = extractContent(msg, type);

  if (!content && !media_url) {
    await msg.react('❓');
    return;
  }

  // Save to Supabase
  const { error } = await supabase.from('posts').insert({
    type,
    content,
    media_url,
    discord_message_id: msg.id,
    created_at: msg.createdAt.toISOString(),
  });

  if (error) {
    console.error('Supabase error:', error);
    await msg.react('❌');
    return;
  }

  // Confirm with emoji per type
  const emoji = { thought: '💭', photo: '📸', music: '🎵', link: '🔗' }[type] || '✅';
  await msg.react(emoji);
  console.log(`[${new Date().toISOString()}] Saved ${type}: ${content?.slice(0, 60) ?? media_url}`);
});

// ── Handle message delete — remove from DB too ─────────────────
discord.on(Events.MessageDelete, async (msg) => {
  if (msg.channelId !== WATCHED_CHANNEL) return;
  await supabase.from('posts').delete().eq('discord_message_id', msg.id);
  console.log(`[${new Date().toISOString()}] Deleted post: ${msg.id}`);
});

// ── Handle message edit — update content ───────────────────────
discord.on(Events.MessageUpdate, async (_, newMsg) => {
  if (newMsg.channelId !== WATCHED_CHANNEL) return;
  if (newMsg.author?.bot) return;

  const type = detectType(newMsg);
  const { content } = extractContent(newMsg, type);

  await supabase
    .from('posts')
    .update({ content, type, updated_at: new Date().toISOString() })
    .eq('discord_message_id', newMsg.id);

  await newMsg.react('✏️');
  console.log(`[${new Date().toISOString()}] Updated post: ${newMsg.id}`);
});

// ── Ready ──────────────────────────────────────────────────────
discord.once(Events.ClientReady, (c) => {
  console.log(`✅ Bot online as ${c.user.tag}`);
  console.log(`   Watching channel: ${WATCHED_CHANNEL}`);
});

discord.login(process.env.DISCORD_TOKEN);
