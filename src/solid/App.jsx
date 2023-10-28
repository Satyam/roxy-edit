import { createSignal, Switch, Match } from 'solid-js';
import classes from './App.module.css';
import Select from './Select';
import Icon from './Icon';

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
          <Icon name="documents" />
          Páginas / Posts
        </button>
        <button
          name="menuEditor"
          onclick={clickHandler}
          disabled={activeTab() === 'menuEditor'}
        >
          <Icon name="edit-menu" />
          Editor de Menú
        </button>
        <button
          name="site"
          onclick={clickHandler}
          disabled={activeTab() === 'site'}
        >
          <Icon name="cloud" />
          Adm. Sitio
        </button>
        <button
          name="exit"
          onclick={clickHandler}
          disabled={activeTab() === 'exit'}
        >
          <Icon name="exit" />
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
