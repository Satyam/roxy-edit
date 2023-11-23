import { createSignal, For, Show, createEffect, mergeProps } from 'solid-js';

const SplitSelList = (args) => {
  const props = mergeProps(
    {
      items: [],
      selected: [],
      title: 'Items',
      callback: () => {},
    },
    args
  );
  const [selected, setSelected] = createSignal(props.selected);
  const [newItem, setNewItem] = createSignal();

  createEffect(() => {
    props.callback(newItem() ? [...selected(), newItem()].sort() : selected());
  });

  const removeItem = (item) => {
    setSelected((selected) => selected.toSpliced(selected.indexOf(item), 1));
  };

  const addItem = (item) => {
    setSelected((selected) => [...selected, item].sort());
  };

  const changeNewItem = (ev) => {
    setNewItem(ev.target.value);
  };

  return (
    <fieldset
      class="two-halves"
      title="Ingresa un nuevo item y/o haz clic en alguno de los items para moverlos de lado a lado"
    >
      <legend>{props.title}</legend>
      <div>
        <input
          title="Puedes ingresar un nuevo item aquí"
          onInput={changeNewItem}
          value={newItem() ?? ''}
        />
        <br />
        <ul
          class="selection"
          title="Puedes clicar en los items para agregarlos"
        >
          <For each={props.items.sort()}>
            {(item) => (
              <Show when={!selected().includes(item)}>
                <li onClick={[addItem, item]}>{item}</li>
              </Show>
            )}
          </For>
        </ul>
      </div>
      <fieldset>
        <legend>Seleccionadas:</legend>
        <select multiple hidden name={props.name}>
          <Show when={newItem()}>
            <option value={newItem()} selected />
          </Show>
          <For each={selected()}>
            {(item) => <option value={item} selected />}
          </For>
        </select>
        <ul
          class="selectedItems"
          title="Puedes clicar en los items para eliminarlos"
        >
          <Show when={newItem()}>
            <li onClick={() => setNewItem()}>{newItem()}</li>
          </Show>
          <For each={selected()}>
            {(item) => <li onClick={[removeItem, item]}>{item}</li>}
          </For>
        </ul>
      </fieldset>
    </fieldset>
  );
};

export default SplitSelList;
