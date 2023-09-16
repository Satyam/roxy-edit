import open from 'open';

import express from 'express';

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
  await open(`http://localhost:${port}`);
});
