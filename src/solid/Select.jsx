import { createSignal, Switch, Match } from 'solid-js';
import ListPages from './ListPages';

function Select() {
  const [selection, setSelection] = createSignal('');

  const clickHandler = (ev) => {
    setSelection(ev.target.name);
  };

  return (
    <section id="select">
      <div class="two-grid">
        <div id="selectButtons">
          <fieldset>
            <legend>Página</legend>
            <button
              name="newPage"
              onclick={clickHandler}
              disabled={selection() === 'newPage'}
            >
              <span class="icon-left new-doc"></span>Nueva
            </button>
            <button
              name="editPage"
              onclick={clickHandler}
              disabled={selection() === 'editPage'}
            >
              <span class="icon-left edit-doc"></span>Modificar
            </button>
            <button
              name="draftPage"
              onclick={clickHandler}
              disabled={selection() === 'draftPage'}
            >
              <span class="icon-left draft-doc"></span>Borradores
            </button>
          </fieldset>
          <fieldset>
            <legend>Post</legend>
            <button
              name="newPost"
              onclick={clickHandler}
              disabled={selection() === 'newPost'}
            >
              <span class="icon-left new-doc"></span>Nuevo
            </button>
            <button
              name="editPost"
              onclick={clickHandler}
              disabled={selection() === 'editPost'}
            >
              <span class="icon-left edit-doc"></span>Modificar
            </button>
            <button
              name="draftPost"
              onclick={clickHandler}
              disabled={selection() === 'draftPost'}
            >
              <span class="icon-left draft-doc"></span>Borradores
            </button>
          </fieldset>
        </div>
        <Switch fallback={<div>Seleccione alguna opción de la izquierda</div>}>
          <Match when={selection() === 'newPage'}>aquí va nueva página</Match>
          <Match when={selection() === 'editPage'}>
            <ListPages />
          </Match>

          <Match when={selection() === 'draftPage'}>Estamos en draftPage</Match>
          <Match when={selection() === 'newPost'}>Estamos en newPost</Match>
          <Match when={selection() === 'editPost'}>Estamos en editPost</Match>
          <Match when={selection() === 'draftPost'}>Estamos en draftPost</Match>
        </Switch>
      </div>
    </section>
  );
}

export default Select;
