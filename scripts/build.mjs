import { cp, mkdir, rm } from 'node:fs/promises';

const output = new URL('../dist/', import.meta.url);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const entry of ['index.html', 'beatmaker.html', 'assets', 'chillbill', 'robots.txt', 'sitemap.xml']) {
  await cp(new URL(`../${entry}`, import.meta.url), new URL(entry, output), {
    recursive: true,
  });
}

console.log('Static site built in dist/.');
