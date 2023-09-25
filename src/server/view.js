import express from 'express';
import open, { apps } from 'open';

import { ROUTES, PORT } from '../common';

export const viewRouter = new express.Router();
export default viewRouter;

const commands = {
  viewLocal: () => open(`http://localhost:${PORT}${ROUTES.ROXY}/`),
  viewRemote: () => open('http://roxanacabut.com'),
};

viewRouter.get('/:command', async (req, res) => {
  const command = commands[req.params.command];
  if (command) {
    await command();
  }
});
