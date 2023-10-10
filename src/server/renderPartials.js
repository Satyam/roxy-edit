import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const partialsRx = /\{\{>\s*(\w+)\s*}\}/g;

const includes = {};

export const renderPartial = async (
  fragment,
  { base = '.', ext = '.html' }
) => {
  const matches = fragment.matchAll(partialsRx);
  for (const [_, include] of matches) {
    if (!(include in includes)) {
      includes[include] = await readFile(
        join(base, include + (extname(include) ? '' : ext)),
        'utf8'
      );
    }
  }
  return fragment.replaceAll(partialsRx, (_, include) => includes[include]);
};
