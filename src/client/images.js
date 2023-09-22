import { join } from './utils';
import { getEditorImages, getEditorContents } from './editor';

const canvas = document.getElementById('canvas');

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
    const response = await fetch(join('/images', img.name), {
      method: 'POST',
      body: canvas.toDataURL(),
    });
    if (response.ok) {
      imgEl.src = join('/images', await response.text());
      imgEl.setAttribute('origin-size', `${w},${h}`);
      console.log(imgEl.outerHTML);
    } else {
      console.error('response not ok');
    }
  }
  return getEditorContents();
};
