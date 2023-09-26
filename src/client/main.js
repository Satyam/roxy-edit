import { onClick, join } from './utils';

import { loadInfo } from './data';

import { EVENT, dispatch } from './events';
import { editMenu } from './menu';
import './hexo';
import { selectInit, clearSelect } from './select';
import { ROUTES } from '../common';

const CNAMES = {
  MENU: 'menu',
  SITE: 'site',
};

const main = document.getElementById('main');

const exit = async (err) => {
  await fetch(join(ROUTES.EXIT, Number(err)));
  window.close();
};
window.addEventListener('beforeunload', () => {
  exit();
});

loadInfo()
  .then(async () => {
    let tabSelected = document.querySelector('header button[name="select"]');
    tabSelected.setAttribute('disabled', '');
    selectInit();

    onClick(
      'header',
      async (btn) => {
        if (btn === tabSelected) return;

        if (await dispatch(EVENT.PAGE_SWITCH, btn.name)) return;
        tabSelected.removeAttribute('disabled');
        tabSelected = btn;
        btn.setAttribute('disabled', '');
        switch (btn.name) {
          case 'select':
            clearSelect();
            // main.className = CNAMES.SELECT;
            break;
          case 'menuEditor':
            main.className = CNAMES.MENU;
            editMenu();
            break;
          case 'site':
            main.className = CNAMES.SITE;
            break;
          case 'exit':
            dispatch(EVENT.EXIT).then(async (ev) => {
              if (!ev) {
                exit();
              }
            });
            break;
        }
      },
      'button'
    );
  })
  .catch((err) => {
    console.log(err);
    exit(err);
  });
