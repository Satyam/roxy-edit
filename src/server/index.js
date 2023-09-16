import express from 'express';
import open from 'open';

import { loadInfo } from './data.js';
import { initImages } from './images.js';

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use('/node_modules', express.static('node_modules'));

app.get('/exit/:code?', (req, res) => {
  res.end('gone');
  console.log('The End');
  process.exit(req.params.code ?? 0);
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
  await loadInfo();
  await initImages();
  await open(`http://localhost:${port}`);
});
