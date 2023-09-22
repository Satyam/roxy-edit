import express from 'express';
import bodyParser from 'body-parser';
import open from 'open';
import { join } from 'node:path';

import imgRouter from './images.js';
import menuRouter from './menu.js';
import filesRouter from './files.js';
import { CWD, infoRouter } from './data.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.text({ limit: 5_000_000 }));

app.use(express.static('public'));

app.use('/node_modules', express.static('node_modules'));

app.use('/images', imgRouter);
app.use('/files', filesRouter);
app.use('/images', menuRouter);
app.use('/info', infoRouter);
app.use('/menu', menuRouter);

app.get('/favicon.ico', (_, res) => {
  res.sendFile(join(CWD, 'public/icons/appIcon.png'));
});
app.get('/exit/:code?', (req, res) => {
  res.end('gone');
  console.log('The End');
  process.exit(req.params.code ?? 0);
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
  await open(`http://localhost:${port}`);
});
