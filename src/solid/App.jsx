import { createSignal, Switch, Match, onCleanup } from 'solid-js';
import classes from './App.module.css';
import Select from './Select';
import Icon from './Icon';
import { join } from './utils';
import { ROUTES } from '../common';

const exit = async (err = 0) => {
  await fetch(join(ROUTES.EXIT, Number(err)));
  window.close();
};
window.addEventListener('beforeunload', () => {
  exit();
});

function App() {
  const [activeTab, setActiveTab] = createSignal('select');

  onCleanup(exit);

  const clickHandler = (ev) => {
    setActiveTab(ev.target.name);
  };

  return (
    <>
      <header class={classes.header}>
        <button
          name="select"
          onclick={clickHandler}
          disabled={activeTab() === 'select'}
        >
          <Icon>documents</Icon>
          Páginas / Posts
        </button>
        <button
          name="menuEditor"
          onclick={clickHandler}
          disabled={activeTab() === 'menuEditor'}
        >
          <Icon>edit-menu</Icon>
          Editor de Menú
        </button>
        <button
          name="site"
          onclick={clickHandler}
          disabled={activeTab() === 'site'}
        >
          <Icon>cloud</Icon>
          Adm. Sitio
        </button>
        <div></div>
        <button name="exit" onclick={(ev) => exit()}>
          <Icon>exit</Icon>
          Salir
        </button>
      </header>
      <main>
        <Switch
          fallback={
            <div>Seleccione alguna opción de los botones de arriba</div>
          }
        >
          <Match when={activeTab() === 'select'}>
            <Select />
          </Match>
          <Match when={activeTab() === 'menuEditor'}>
            Estamos en MENU Edit
          </Match>
          <Match when={activeTab() === 'site'}>Estamos en SITE</Match>
          <Match when={activeTab() === 'exit'}>Estamos en EXIT</Match>
        </Switch>
      </main>
    </>
  );
}

export default App;
