import { createRoot, createResource } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { fetchJson, sendJson } from '../fetch';
import { ROUTES } from '../common';

const defaultInfo = {
  pages: [],
  posts: [],
  categories: [],
  tags: [],
  authors: [],
  drafts: [],
};

export default createRoot(() => {
  const [info, _setInfo] = createStore(defaultInfo);

  createResource(() => fetchJson(ROUTES.INFO), {
    storage: () => [() => info, (getter) => _setInfo(reconcile(getter()))],
    initialValue: defaultInfo,
  });

  const setInfo = async (...newInfo) => {
    _setInfo(...newInfo);
    await sendJson(ROUTES.INFO, info);
  };

  return {
    info,
    setInfo,
  };
});
