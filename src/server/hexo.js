import express from 'express';
import Hexo from 'hexo';
import open from 'open';

import { HEXO_DIR } from './data';
import { ROUTES } from '../common';

export const hexoRouter = new express.Router();
export default hexoRouter;

const terminal = [];
let done = false;

const send = (msg, event = 'LOG') => {
  terminal.push(`${event}: ${msg}`);
};

const escRx = /\x1b\[\d+m/gm;

function replaceStr(string, ...placeholders) {
  if (typeof string === 'object') {
    return `${replaceStr(...placeholders)}\n${JSON.stringify(string, null, 2)}`;
  } else {
    const replaced = string.replaceAll(/%[sd]/g, () =>
      placeholders.shift().toString()
    );
    return [replaced, ...placeholders].join('\n').replaceAll(escRx, '');
  }
}

const setFakeConsole = (hexo) => {
  console.log('setting fake console');
  ['trace', 'info', 'warn', 'error', 'fatal' /*,'log'*/].forEach((type) => {
    hexo.log[type] = (...args) => send(replaceStr(...args), type.toUpperCase());
  });
};

const commands = {
  generate: (hexo) => hexo.call('generate', {}),
  viewLocal: (hexo) => open(`http://localhost:${PORT}${ROUTES.ROXY}`),
  viewRemote: (hexo) => open('http://roxanacabut.com'),
  upload: (hexo) => hexo.call('deploy', { generate: true }),
};

hexoRouter.get('/', (_, res) => {
  const poll = () => {
    if (done) {
      res.status(201).send(terminal.join('\n'));
      terminal.length = 0;
    } else {
      if (terminal.length) {
        res.send(terminal.join('\n'));
        terminal.length = 0;
      } else {
        setTimeout(poll, 1000);
      }
    }
  };
  poll();
});

hexoRouter.get('/:command', async (req, res) => {
  const command = commands[req.params.command];
  if (command) {
    const hexo = new Hexo(HEXO_DIR, {});
    try {
      done = false;
      await hexo.init();
      terminal.length = 0;
      setFakeConsole(hexo);
      res.end();
      await command(hexo);
      hexo.exit();
    } catch (err) {
      res.status(500).send(JSON.stringify(err, null, 2));
      hexo.exit(err);
    } finally {
      done = true;
    }
  }
});
