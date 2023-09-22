import express from 'express';
import { writeFile } from 'fs/promises';
import { remove, copy } from 'fs-extra';
import { join } from 'node:path';
import { SRC_PAGES_DIR, DRAFTS_DIR, DELETED_PAGS_DIR } from './data';

export const filesRouter = new express.Router();

const fullFileName = (req) => {
  const p = req.params;
  const fileName = p.fileName;
  const isDraft = p.isDraft === 'true';
  const isPost = p.isPost === 'true';

  if (isDraft) {
    return join(DRAFTS_DIR, isPost ? 'posts' : 'pages', fileName);
  } else {
    return join(SRC_PAGES_DIR, isPost ? '_posts' : '', fileName);
  }
};

const ROUTE = '/:isDraft/:isPost/:fileName';

filesRouter.get(ROUTE, (req, res) => res.sendFile(fullFileName(req)));

filesRouter.post(ROUTE, (req, res) =>
  writeFile(fullFileName(req), req.body).then(
    () => res.status(200).end(),
    (err) => res.status(500).send(err)
  )
);

filesRouter.delete(ROUTE, (req, res) => {
  if (req.params.isDraft) {
    return remove(fullFileName(req)).then(
      () => res.status(200).end(),
      (err) => res.status(500).send(err)
    );
  } else {
    return copy(
      fullFileName(req),
      join(DELETED_PAGS_DIR, req.params.fileName)
    ).then(
      () => res.status(200).end(),
      (err) => res.status(500).send(err)
    );
  }
});

export default filesRouter;
