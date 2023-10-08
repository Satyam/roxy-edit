import express from 'express';
import open from 'open';

import { ROUTES } from '../common';

export const viewRouter = new express.Router();
export default viewRouter;

const commands = {
  viewLocal: (req) =>
    open(`${req.protocol}://${req.get('host')}${ROUTES.ROXY}/`),
  viewRemote: () => open('http://roxanacabut.com'),
};

viewRouter.get('/:command', async (req, res) => {
  const command = commands[req.params.command];
  if (command) {
    await command(req);
  }
});
