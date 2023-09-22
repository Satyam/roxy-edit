import express from 'express';
import { join, extname } from 'node:path';
import { HEXO_IMG_DIR, CWD } from './data.js';
import { readdir, writeFile } from 'fs/promises';

export const imgRouter = new express.Router();
export default imgRouter;

imgRouter.get('/gallery', async (req, res) => {
  const fileDescrs = await readdir(HEXO_IMG_DIR, { withFileTypes: true });

  res.json({
    statusCode: 200,
    result: fileDescrs
      .filter((d) => d.isFile())
      .map((d) => ({ src: join('/images', d.name) })),
  });
});

imgRouter.get('/:img', (req, res) => {
  res.sendFile(join(HEXO_IMG_DIR, req.params.img));
});

const dataUrlRx = /^data:image\/(.+);base64,(.*)$/;

imgRouter.post('/:fileName', async (req, res) => {
  const { fileName } = req.params;
  const blob = req.body;

  const matches = blob.match(dataUrlRx);
  if (matches) {
    const ext = matches[1];
    const data = matches[2];
    const newFileName = fileName.replace(extname(fileName), `.${ext}`);
    console.log(fileName, ext, newFileName);
    const buffer = Buffer.from(data, 'base64');
    writeFile(join(HEXO_IMG_DIR, newFileName), buffer).then(
      () => res.status(200).send(newFileName),
      (err) => res.status(500).send(err)
    );
  } else {
    console.error(
      'DataUrl bad in ',
      fileName,
      'content type:',
      req.get('Content-Type'),
      'typeof data: ',
      typeof blob,
      'sample',
      String(blob).substring(0, 30)
    );
    res.status(415).end();
  }
});
