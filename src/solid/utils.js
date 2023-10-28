const manySlashesRx = /\/{2,}/g;
export const join = (...args) => args.join('/').replaceAll(manySlashesRx, '/');
