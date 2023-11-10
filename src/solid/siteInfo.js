import { createRoot, createEffect, on, createResource } from 'solid-js';
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
    initialValue: info,
  });

  const setInfo = async (newInfo) => {
    await sendJson(ROUTES.INFO, _setInfo(newInfo));
  };
  return {
    info,
    setInfo,
  };
});
