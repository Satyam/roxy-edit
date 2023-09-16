import { join } from 'node:path';
import { readJson, writeJson } from './utils';
import { HEXO_IMG_DIR, EDITOR_IMG_DIR, IMG_DIR } from './data';
import { readdir } from 'fs/promises';

let gallery = null;

const addImageToGallery = async (image) => {
  const src = join(IMG_DIR, image);
  if (!gallery.result.find((item) => item.src === src)) {
    gallery.result.push({ src });
    await writeJson(join(EDITOR_IMG_DIR, 'gallery.json'), gallery);
  }
};

export const initImages = async () => {
  gallery = await readJson(join(EDITOR_IMG_DIR, 'gallery.json'), {
    statusCode: 200,
    result: [],
  });

  await fs.copy(HEXO_IMG_DIR, EDITOR_IMG_DIR, { overwrite: false });

  return Promise.all(readdir(EDITOR_IMG_DIR, { withFileTypes: true })).then(
    (files) =>
      files
        .filter((d) => d.isFile() && d.name !== 'gallery.json')
        .map((d) => addImageToGallery(d.name))
  );
};
