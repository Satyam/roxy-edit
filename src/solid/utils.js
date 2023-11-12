const manySlashesRx = /\/{2,}/g;
export const join = (...args) => args.join('/').replaceAll(manySlashesRx, '/');
export const today = new Date().toISOString().split('T')[0];
