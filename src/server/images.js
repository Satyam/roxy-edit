import express from 'express';
import { join } from 'node:path';
import { HEXO_IMG_DIR, IMG_DIR } from './data.js';
import { readdir } from 'fs/promises';

export const imgRouter = new express.Router();

imgRouter.get('/gallery', async (req, res) => {
  const fileDescrs = await readdir(HEXO_IMG_DIR, { withFileTypes: true });

  res.json({
    statusCode: 200,
    result: fileDescrs
      .filter((d) => d.isFile())
      .map((d) => ({ src: join(IMG_DIR, d.name) })),
  });
});

export default imgRouter;
