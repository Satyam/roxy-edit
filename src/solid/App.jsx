import { Switch, Match, onCleanup } from 'solid-js';
import classes from './App.module.css';
import Select from './Select';
import Icon from './Icon';
import { join } from './utils';
import { ROUTES } from '../common';
import { activeTabSignal, TABS } from './activeTab';
import Editor from './Editor';

const exit = async (err = 0) => {
  await fetch(join(ROUTES.EXIT, Number(err)));
  window.close();
};
window.addEventListener('beforeunload', () => {
  exit();
});

function App() {
  const [activeTab, setActiveTab] = activeTabSignal;

  onCleanup(exit);

  const clickHandler = (ev) => {
    setActiveTab(ev.target.name);
  };

  return (
    <>
      <header class={classes.header}>
        <button
          name={TABS.SELECT}
          onclick={clickHandler}
          disabled={activeTab() === TABS.SELECT}
        >
          <Icon>documents</Icon>
          Páginas / Posts
        </button>
        <button
          name={TABS.MENU}
          onclick={clickHandler}
          disabled={activeTab() === TABS.MENU}
        >
          <Icon>edit-menu</Icon>
          Editor de Menú
        </button>
        <button
          name={TABS.SITE}
          onclick={clickHandler}
          disabled={activeTab() === TABS.SITE}
        >
          <Icon>cloud</Icon>
          Adm. Sitio
        </button>
        <div></div>
        <button name={TABS.EXIT} onclick={(ev) => exit()}>
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
          <Match when={activeTab() === TABS.SELECT}>
            <Select />
          </Match>
          <Match when={activeTab() === TABS.EDITOR}>
            <Editor />
          </Match>
          <Match when={activeTab() === TABS.MENU}>Estamos en MENU Edit</Match>
          <Match when={activeTab() === TABS.SITE}>Estamos en SITE</Match>
          <Match when={activeTab() === TABS.EXIT}>Estamos en EXIT</Match>
        </Switch>
      </main>
    </>
  );
}

export default App;
