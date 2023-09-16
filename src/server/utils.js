import fs from 'fs-extra';

export const readJson = (fileName, defaultValue) =>
  fs.readJSON(fileName).catch(() => defaultValue ?? {});

export const writeJson = (filename, obj) =>
  fs.outputJSON(filename, obj, { spaces: 2 });
