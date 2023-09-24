import { onClick, join } from './utils';

import { ROUTES } from '../common';

const terminal = document.getElementById('terminal');
const hexoButtons = document.getElementById('hexoButtons');

const clearTerminal = () => {
  terminal.innerHTML = '';
};

const escRx = /\x1b\[\d+m/gm;
const progressRx = /--\s*.+\sTamaño:\s*\d+\s*Total:\s*\d+\s*--/m;
const preRx = /<pre>.*<\/pre>/gms;
const emptyInfo = /info\s*$/im;

const appendTerminal = (contents) => {
  console.log('appendTerminal', contents);
  if (emptyInfo.test(contents)) return;
  if (progressRx.test(contents)) {
    const log = terminal.innerHTML;
    if (preRx.test(log)) {
      terminal.innerHTML = log.replace(preRx, `<pre>${contents}</pre>`);
      return;
    } else {
      contents = `<pre>${contents}</pre>`;
    }
  }
  terminal.innerHTML = `${terminal.innerHTML}${contents
    .replaceAll('\n', '<br/>')
    .replaceAll(escRx, '')}`;
  if (contents.length) {
    terminal.lastElementChild?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }
};

const launch = async (command) => {
  console.log('launch', command);
  for (;;) {
    const response = await fetch(join(ROUTES.HEXO, command));
    console.log('loop', response.status);
    command = '';
    switch (response.status) {
      case 200:
        appendTerminal(await response.text());
        break;
      case 201:
        appendTerminal(await response.text());
        return;
      case 502:
        break;
      default:
        appendTerminal(`Error [${response.status}]: ${response.statusText}`);
        return;
    }
  }
};

const anyClick = async () =>
  new Promise((resolve) => {
    terminal.addEventListener(
      'click',
      () => {
        resolve();
      },
      { once: true }
    );
  });

const disableButtons = (d) => {
  for (const btn of hexoButtons.querySelectorAll('button')) {
    btn.disabled = d;
  }
};

onClick(
  hexoButtons,
  async (btn) => {
    disableButtons(true);
    await launch(btn.name);
    appendTerminal('<hr/>Haga click en esta ventana para cerrar');
    await anyClick();
    clearTerminal();
    disableButtons(false);
  },
  'button'
);
