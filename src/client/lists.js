import { getPages, getPosts, getDrafts } from './data';
import { renderTpl } from './tpl';

export const pagesList = () => {
  const drafts = getDrafts();
  const [home, ...pages] = getPages();
  const p = pages
    .toSorted((a, b) => {
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;
      return 0;
    })
    .map((p) => ({
      ...p,
      borrador: drafts.some((d) => d.file === p.file),
    }));
  return renderTpl('tplPagesList', { home, pages: p });
};

export const postsList = () => {
  const drafts = getDrafts(true);

  const tree = new Map();
  let ptr;
  getPosts()
    .toSorted((a, b) => {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
      return 0;
    })
    .forEach((p) => {
      const [y, m, d] = p.date.split('-');
      if (tree.has(y)) {
        ptr = tree.get(y);
      } else {
        tree.set(y, (ptr = new Map()));
      }
      if (ptr.has(m)) {
        ptr = ptr.get(m);
      } else {
        ptr.set(m, (ptr = new Map()));
      }
      if (ptr.has(d)) {
        ptr = ptr.get(d);
      } else {
        ptr.set(d, (ptr = []));
      }
      p.borrador = drafts.some((d) => d.file === p.file);
      ptr.push(p);
    });
  return renderTpl(
    'tplPostsList',
    { tree, drafts },
    { dateFormatter: (date) => date.replace(/(\d+)-(\d+)-(\d+)/, '$3/$2/$1') }
  );
};
