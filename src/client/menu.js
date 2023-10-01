import { onClick, md2rootHtml } from './utils';
// For some reason it works when imported via <script> but dies if imported
// and rolled up.
// import Sortable from 'sortablejs';
import { renderTpl } from './tpl';
import { getPages } from './data';
import { fetchJson, sendJson } from './fetch';
import { ROUTES } from '../common';

let pages = [];

const currentMenu = document.getElementById('currentMenu');
const morePages = document.getElementById('morePages');
const menuEditor = document.getElementById('menuEditor');
const homePage = document.getElementById('homePage');
const saveMenu = document.getElementById('saveMenu');

const basePartRx = /\/?([^\.]+).*/;

const enableSaveMenu = (enable) => {
  saveMenu.disabled = !enable;
};

enableSaveMenu(false);

const renderMenuObj = (menu) =>
  Object.keys(menu)
    .map((label) => {
      const value = menu[label];
      if (typeof value === 'string') {
        pages.some((p) => {
          if (
            p.file.replace(basePartRx, '$1') === value.replace(basePartRx, '$1')
          ) {
            p.used = true;
            return true;
          }
        });
        return renderTpl('tplLeafItem', { label, value });
      } else {
        return renderTpl('tplMainItem', { label, value }, { renderMenuObj });
      }
    })
    .join('\n');

export const editMenu = async () => {
  pages = Array.from(getPages());

  const menu = await fetchJson(ROUTES.MENU);

  currentMenu.innerHTML = renderMenuObj(menu);
  const h = pages.find((p) => p.file === 'index.md');
  h.used = true;
  homePage.innerHTML = renderTpl('tplHomePage', { h });
  morePages.innerHTML = renderTpl('tplMorePages', {
    pages: pages.filter((p) => !p.used),
  });

  const options = {
    group: 'nested',
    filter: '.empty',
    animation: 150,
    fallbackOnBody: true,
    swapThreshold: 0.65,
    onEnd: (ev) => {
      enableSaveMenu(true);
      const { from, item, to } = ev;
      console.log({ from, item, to });
      if (from.getAttribute('id') === 'nuevaCarpeta') {
        from.innerHTML = renderTpl('tplNewFolder');
        item.innerHTML = renderTpl('tplNewEmptyFolder');
        new Sortable(item.querySelector('.draggable'), options);
      }
      if (from.children.length === 0) {
        from.innerHTML = renderTpl('tplEmptyFolder');
      }
      for (const empty of currentMenu.querySelectorAll('li.empty')) {
        if (empty.closest('ul').children.length > 1) {
          empty.remove();
        }
      }
      for (const empty of morePages.querySelectorAll('li.empty')) {
        const ul = empty.closest('ul');
        if (ul.children.length === 1) {
          ul.closest('li').remove();
        }
      }
    },
  };

  for (const el of menuEditor.querySelectorAll('.draggable')) {
    new Sortable(el, options);
  }
};

onClick(saveMenu, async () => {
  const parseUl = (ulEl) => {
    const subMenu = {};
    for (const liEl of ulEl.children) {
      const label = liEl.querySelector('span.title').innerText.trim();
      const subUl = liEl.querySelector('ul');
      if (subUl) {
        subMenu[label] = parseUl(subUl);
      } else {
        subMenu[label] = liEl.getAttribute('title');
      }
    }
    return subMenu;
  };
  enableSaveMenu(false);
  await sendJson(ROUTES.MENU, parseUl(currentMenu));
});

currentMenu.addEventListener('input', (ev) => {
  enableSaveMenu(true);
});
