import express from 'express';
import bodyParser from 'body-parser';
import open from 'open';
import { join } from 'node:path';

import imgRouter from './images.js';
import menuRouter from './menu.js';
import filesRouter from './files.js';
import hexoRouter from './hexo.js';
import viewRouter from './view.js';
import { CWD, infoRouter } from './data.js';
import { ROUTES } from '../common.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.text({ limit: 5_000_000 }));

app.use(express.static(join(CWD, 'dist')));
// app.use(express.static(join(CWD, 'public')));

app.use('/node_modules', express.static('node_modules'));
app.use(ROUTES.ROXY, express.static(join(CWD, 'hexo/public')));

app.use(ROUTES.IMAGES, imgRouter);
app.use(ROUTES.FILES, filesRouter);
app.use(ROUTES.INFO, infoRouter);
app.use(ROUTES.MENU, menuRouter);
app.use(ROUTES.HEXO, hexoRouter);
app.use(ROUTES.VIEW, viewRouter);

app.get('/favicon.ico', (_, res) => {
  res.sendFile(join(CWD, 'public/icons/appIcon.png'));
});

app.get(join(ROUTES.EXIT, '/:code?'), (req, res) => {
  res.end('gone');
  process.exit(req.params.code ?? 0);
});

const server = app.listen(0, async () => {
  console.log(`Example app listening on port ${server.address().port}`);
  await open(`http://localhost:${server.address().port}`);
});
