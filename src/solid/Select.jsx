import { createSignal, Switch, Match } from 'solid-js';
import ListPages from './ListPages';
import Icon from './Icon';

const BUTTONS = {
  NEW_PAGE: 'newPage',
  EDIT_PAGE: 'editPage',
  DRAFT_PAGE: 'draftPage',
  NEW_POST: 'newPost',
  EDIT_POST: 'editPost',
  DRAFT_POST: 'draftPost',
};

function Select() {
  const [selection, setSelection] = createSignal('');

  const clickHandler = (ev) => {
    setSelection(ev.target.name);
  };

  return (
    <div class="two-grid">
      <div id="selectButtons">
        <fieldset>
          <legend>Página</legend>
          <button
            name={BUTTONS.NEW_PAGE}
            onclick={clickHandler}
            disabled={selection() === BUTTONS.NEW_PAGE}
          >
            <Icon>new-doc</Icon>
            Nueva
          </button>
          <button
            name={BUTTONS.EDIT_PAGE}
            onclick={clickHandler}
            disabled={selection() === BUTTONS.EDIT_PAGE}
          >
            <Icon>edit-doc</Icon>
            Modificar
          </button>
          <button
            name={BUTTONS.DRAFT_PAGE}
            onclick={clickHandler}
            disabled={selection() === BUTTONS.DRAFT_PAGE}
          >
            <Icon>draft-doc</Icon>
            Borradores
          </button>
        </fieldset>
        <fieldset>
          <legend>Post</legend>
          <button
            name={BUTTONS.NEW_POST}
            onclick={clickHandler}
            disabled={selection() === BUTTONS.NEW_POST}
          >
            <Icon>new-doc</Icon>
            Nuevo
          </button>
          <button
            name={BUTTONS.EDIT_POST}
            onclick={clickHandler}
            disabled={selection() === BUTTONS.EDIT_POST}
          >
            <Icon>edit-doc</Icon>
            Modificar
          </button>
          <button
            name={BUTTONS.DRAFT_POST}
            onclick={clickHandler}
            disabled={selection() === BUTTONS.DRAFT_POST}
          >
            <Icon>draft-doc</Icon>
            Borradores
          </button>
        </fieldset>
      </div>
      <Switch fallback={<div>Seleccione alguna opción de la izquierda</div>}>
        <Match when={selection() === BUTTONS.NEW_PAGE}>
          aquí va nueva página
        </Match>
        <Match when={selection() === BUTTONS.EDIT_PAGE}>
          <ListPages />
        </Match>
        <Match when={selection() === BUTTONS.DRAFT_PAGE}>
          Estamos en draftPage
        </Match>
        <Match when={selection() === BUTTONS.NEW_POST}>
          Estamos en newPost
        </Match>
        <Match when={selection() === BUTTONS.EDIT_POST}>
          Estamos en editPost
        </Match>
        <Match when={selection() === BUTTONS.DRAFT_POST}>
          Estamos en draftPost
        </Match>
      </Switch>
    </div>
  );
}

export default Select;
