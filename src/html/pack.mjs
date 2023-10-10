import { readFile, writeFile } from 'node:fs/promises';

const handles = /\{\{>\s*(\w+)\s*}\}/g;

const index = await readFile('src/html/index.html', 'utf8');

const matches = index.matchAll(handles);
const includes = {};
for (const [_, include] of matches) {
  includes[include] = await readFile(`src/html/${include}.html`, 'utf8');
}
writeFile(
  'public/index.html',
  index.replaceAll(handles, (_, include) => includes[include])
);
