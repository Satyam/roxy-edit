import express from 'express';
import bodyParser from 'body-parser';
import open from 'open';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'url';

import imgRouter from './images.js';
import menuRouter from './menu.js';
import filesRouter from './files.js';
import hexoRouter from './hexo.js';
import { CWD, infoRouter } from './data.js';
import { ROUTES, PORT } from '../common.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.text({ limit: 5_000_000 }));

app.use(express.static('public'));

app.use('/node_modules', express.static('node_modules'));

app.use(ROUTES.IMAGES, imgRouter);
app.use(ROUTES.FILES, filesRouter);
app.use(ROUTES.INFO, infoRouter);
app.use(ROUTES.MENU, menuRouter);
app.use(ROUTES.HEXO, hexoRouter);

app.get('/favicon.ico', (_, res) => {
  res.sendFile(join(CWD, 'public/icons/appIcon.png'));
});
app.get(join(ROUTES.EXIT, '/:code?'), (req, res) => {
  res.end('gone');
  console.log('The End');
  process.exit(req.params.code ?? 0);
});

app.listen(PORT, async () => {
  console.log(`Example app listening on port ${PORT}`);
  await open(`http://localhost:${PORT}`);
});
