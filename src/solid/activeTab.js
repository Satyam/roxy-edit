import { createRoot, createSignal } from 'solid-js';

export const TABS = {
  SELECT: 'select',
  EDITOR: 'editor',
  MENU: 'menuEditor',
  SITE: 'site',
  EXIT: 'exit',
};
export const activeTabSignal = createRoot(() => createSignal(TABS.SELECT));

export default activeTabSignal;
