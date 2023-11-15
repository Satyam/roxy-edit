import { createRoot, createResource, createEffect } from 'solid-js';
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

  const [fetchStatus] = createResource(fetchJson(ROUTES.INFO), {
    initialValue: defaultInfo,
  });

  createEffect(() => {
    if (fetchStatus.state === 'ready') {
      _setInfo(reconcile(fetchStatus()));
    }
  });

  const [saveStatus, { refetch }] = createResource((_, { refetching }) => {
    if (refetching) sendJson(ROUTES.INFO, info);
  });

  const setInfo = (...newInfo) => {
    _setInfo(...newInfo);
    refetch();
  };

  return {
    fetchStatus,
    saveStatus,
    info,
    setInfo,
  };
});
