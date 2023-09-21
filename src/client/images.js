import { join } from './utils';
import { HEXO_IMG_DIR, EDITOR_IMG_DIR, DOCUMENT_ROOT, IMG_DIR } from './data';
import { getEditorImages } from './editor';

// const fs = Neutralino.filesystem;

const canvas = document.getElementById('canvas');

const getBlob = (canvas) =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob));
  });

export const replaceImages = async () => {
  const ctx = canvas.getContext('2d');
  const images = getEditorImages();

  for (const img of images) {
    const imgEl = img.element;
    if (!img.src.startsWith('data:')) continue;
    const w = 800;
    const h = Math.ceil(800 * (imgEl.naturalHeight / imgEl.naturalWidth));
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(imgEl, 0, 0, w, h);
    const imgFileName = join(EDITOR_IMG_DIR, img.name);
    const blob = await getBlob(canvas);
    const buffer = await blob.arrayBuffer();
    // await fs.writeBinaryFile(imgFileName, buffer);
    imgEl.src = join(IMG_DIR, img.name);
    imgEl.setAttribute('origin-size', `${w},${h}`);
  }
  await addImagesToGallery(images.map((img) => img.name));
};
