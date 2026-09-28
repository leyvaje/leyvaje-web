import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pages = [
  'index.html',
  'beatmaker.html',
  'chillbill/index.html',
  'chillbill/en/index.html',
  'chillbill/support/index.html',
  'chillbill/en/support/index.html',
  'chillbill/privacy/index.html',
  'chillbill/en/privacy/index.html',
];
const issues = [];

for (const relativePage of pages) {
  const filename = path.join(root, relativePage);
  const html = await readFile(filename, 'utf8');
  const checks = [
    [/<!doctype html>/i, 'missing doctype'],
    [/<html[^>]+lang=["'][^"']+["']/i, 'missing document language'],
    [/<title>[^<]+<\/title>/i, 'missing title'],
    [/<meta[^>]+name=["']description["']/i, 'missing meta description'],
    [/<link[^>]+rel=["']canonical["']/i, 'missing canonical URL'],
  ];

  for (const [pattern, message] of checks) {
    if (!pattern.test(html)) issues.push(`${relativePage}: ${message}`);
  }

  if (relativePage.startsWith('chillbill/')) {
    const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length;
    if (h1Count !== 1) issues.push(`${relativePage}: expected one h1, found ${h1Count}`);

    for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
      if (!/\balt=["'][^"']*["']/i.test(image[0])) {
        issues.push(`${relativePage}: image is missing alt text`);
      }
    }

    for (const target of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
      const reference = target[1];
      if (/^(?:https?:|mailto:|tel:|#|data:)/.test(reference)) continue;
      const cleanReference = reference.split(/[?#]/)[0];
      const localPath = cleanReference.startsWith('/')
        ? path.join(root, cleanReference)
        : path.resolve(path.dirname(filename), cleanReference);
      const candidate = path.extname(localPath) ? localPath : path.join(localPath, 'index.html');
      try {
        await access(candidate);
      } catch {
        issues.push(`${relativePage}: local reference not found: ${reference}`);
      }
    }
  }
}

for (const crawlerFile of ['robots.txt', 'sitemap.xml']) {
  try {
    await access(path.join(root, crawlerFile));
  } catch {
    issues.push(`missing ${crawlerFile}`);
  }
}

const css = await readFile(path.join(root, 'chillbill/assets/chillbill.css'), 'utf8');
const openingBraces = (css.match(/{/g) ?? []).length;
const closingBraces = (css.match(/}/g) ?? []).length;
if (openingBraces !== closingBraces) issues.push('chillbill.css: unbalanced braces');

if (issues.length > 0) {
  console.error(issues.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Validated ${pages.length} HTML pages and ChillBill CSS.`);
}
