import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from 'esbuild';
import { minify as htmlMinify } from 'html-minifier';
import { parse } from 'node-html-parser';

function resolveConfigPath(path) {
  return join(fileURLToPath(import.meta.url), '..', '..', path);
}

function minifyHtml(html) {
  return htmlMinify(html, {
    collapseWhitespace: true,
    removeComments: true,
    html5: true,
  });
}

const config = JSON.parse(await readFile('build.json', 'utf-8'));
const outDir = resolveConfigPath(config.out);

await mkdir(outDir, { recursive: true });

// Bundle & minify CSS
await build({
  entryPoints: [resolveConfigPath(config.cssEntry)],
  bundle: true,
  minify: true,
  outfile: join(resolveConfigPath(config.out), 'styles.css'),
});

// Minify JS
const scripts = resolveConfigPath(config.scripts);
await build({
  entryPoints: [scripts],
  minify: true,
  outdir: join(outDir, 'scripts'),
});

// Copy assets
const assets = resolveConfigPath(config.assets);
await cp(assets, join(outDir, 'assets'), { recursive: true });

// Minify locales
const locales = resolveConfigPath(config.locales);
await mkdir(join(outDir, 'locales'), { recursive: true });
const localeFiles = await readdir(locales);
for (const file of localeFiles) {
  await writeFile(
    join(outDir, 'locales', file),
    JSON.stringify(JSON.parse(await readFile(join(locales, file), 'utf-8')))
  );
}

// Copy and minify index.html
const index = resolveConfigPath(config.index);
const indexContent = await readFile(index, 'utf-8');
const indexRoot = parse(indexContent);
indexRoot.querySelector('link').setAttribute('href', '/styles.css');
await writeFile(join(outDir, 'index.html'), minifyHtml(indexRoot.toString()));

// Create pages
const pageTemplate = await readFile('page.template.html', 'utf-8');
await mkdir(join(outDir, 'pages'), { recursive: true });
for (const page of config.pages) {
  // Page content file
  const path = resolveConfigPath(page.file);
  const minified = minifyHtml(await readFile(path, 'utf-8'));
  await writeFile(join(outDir, page.file), minified);

  // Page template file
  const pageFolder = join(outDir, page.route);
  await mkdir(pageFolder, { recursive: true });
  await writeFile(
    join(pageFolder, 'index.html'),
    minifyHtml(
      pageTemplate.replace('{PAGE}', page.name).replace('{ROUTE}', page.route)
    )
  );
}

// Copy robots.txt
await cp(resolveConfigPath(config.robots), join(outDir, 'robots.txt'));
