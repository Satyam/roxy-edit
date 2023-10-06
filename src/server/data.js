import express from 'express';
import { join, dirname } from 'node:path';
import { readJson, writeJson } from './utils.js';
import { fileURLToPath } from 'node:url';

export const __dirname = dirname(fileURLToPath(import.meta.url));
export const CWD = dirname(__dirname);
export const HEXO_DIR = join(CWD, 'hexo/');
export const DOCUMENT_ROOT = join(CWD, 'server/');
export const IMG_DIR = 'assets/img/';
// export const HEXO_FILES_LIST = join(HEXO_DIR, 'files.json');
export const SRC_PAGES_DIR = join(HEXO_DIR, 'source/');
export const DELETED_PAGS_DIR = join(SRC_PAGES_DIR, '_deleted');
export const HEXO_IMG_DIR = join(SRC_PAGES_DIR, IMG_DIR);
export const DRAFTS_DIR = join(DOCUMENT_ROOT, 'drafts/');
const INFO_JSON = join(DOCUMENT_ROOT, 'info.json');
export const EDITOR_IMG_DIR = join(DOCUMENT_ROOT, IMG_DIR);
export const MENU_CONFIG = join(HEXO_DIR, '_config.roxy.yml');

let info;

export const infoRouter = new express.Router();
export default infoRouter;
infoRouter.get('/', async (_, res) => {
  if (!info) {
    try {
      info = Object.assign(
        {
          pages: [],
          posts: [],
          categories: [],
          tags: [],
          authors: [],
          drafts: [],
        },
        await readJson(INFO_JSON)
      );
    } catch (err) {
      res.status(500).send(err);
    }
    ['categories', 'tags', 'authors'].forEach((sel) => {
      info[sel].sort();
    });
  }
  res.send(info);
});

infoRouter.post('/', (req, res) => {
  info = req.body;
  writeJson(INFO_JSON, info).then(
    () => res.status(200).end(),
    (err) => res.status(500).send(err)
  );
});
