import express from 'express';
import bodyParser from 'body-parser';
import open from 'open';
import { join, dirname } from 'node:path';
import { readFile } from 'node:fs/promises';

import imgRouter from './images.js';
import menuRouter from './menu.js';
import filesRouter from './files.js';
import hexoRouter from './hexo.js';
import viewRouter from './view.js';
import { CWD, infoRouter } from './data.js';
import { ROUTES, PORT } from '../common.js';

const app = express();

const handles = /\{\{\s*(\w+)\s*}\}/g;

app.engine('html', async (filePath, options, callback) => {
  const dir = dirname(filePath);
  try {
    const index = await readFile(filePath, 'utf8');

    const matches = index.matchAll(handles);
    const includes = {};
    for (const [_, include] of matches) {
      includes[include] = await readFile(`${join(dir, include)}.html`, 'utf8');
    }
    return callback(
      null,
      index.replaceAll(handles, (_, include) => includes[include])
    );
  } catch (err) {
    callback(err, '');
  }
});
app.set('views', 'src/html'); // specify the views directory
app.set('view engine', 'html'); // register the template engine

app.use(bodyParser.json());
app.use(bodyParser.text({ limit: 5_000_000 }));

app.get('/', (req, res) => {
  res.render('index.html', {});
});

app.use(express.static('public'));

app.use('/node_modules', express.static('node_modules'));
app.use(ROUTES.ROXY, express.static('hexo/public'));

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

app.listen(PORT, async () => {
  console.log(`Example app listening on port ${PORT}`);
  await open(`http://localhost:${PORT}`);
});
