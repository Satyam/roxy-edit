import express from 'express';
import { parse, stringify } from 'yaml';
import { readFile, writeFile } from 'fs/promises';
import { MENU_CONFIG } from './data';

export const menuRouter = new express.Router();

menuRouter.get('/', (_, res) => {
  readFile(MENU_CONFIG, 'utf-8').then(
    (config) => res.send(parse(config).menu),
    (err) => res.status(500).send(err)
  );
});

menuRouter.post('/', (req, res) =>
  writeFile(MENU_CONFIG, stringify({ menu: req.body })).then(
    () => res.status(200).end(),
    (err) => res.status(500).send(err)
  )
);

export default menuRouter;
