import { createSignal, Switch, Match } from 'solid-js';
import classes from './App.module.css';

function App() {
  const [activeTab, setActiveTab] = createSignal('select');

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
          <span class="icon-left documents"></span>Páginas / Posts
        </button>
        <button
          name="menuEditor"
          onclick={clickHandler}
          disabled={activeTab() === 'menuEditor'}
        >
          <span class="icon-left edit-menu"></span>Editor de Menú
        </button>
        <button
          name="site"
          onclick={clickHandler}
          disabled={activeTab() === 'site'}
        >
          <span class="icon-left cloud"></span>Adm. Sitio
        </button>
        <button
          name="exit"
          onclick={clickHandler}
          disabled={activeTab() === 'exit'}
        >
          <span class="icon-left exit"></span>Salir
        </button>
      </header>
      <main>
        <Switch fallback={<div>Select tab from above</div>}>
          <Match when={activeTab() === 'select'}>Estamos en SELECT</Match>
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
