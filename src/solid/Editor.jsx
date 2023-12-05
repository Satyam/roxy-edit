import { Show, For, createSignal } from 'solid-js';
import SunEditor from './SunEditor';
import Icon from './Icon';
import useDocData from './useDocData';
import useSiteInfo from './useSiteInfo';
import SplitSelList from './SplitSelList';
import { today } from './utils';
import useForm from './useForm';

import './Editor.css';

const ErrorMessage = (props) => (
  <Show when={props.error}>
    <span class="error-message">{props.error}</span>
  </Show>
);

export function Editor() {
  const [isChanged, setChanged] = createSignal(false);
  const { doc, readStatus } = useDocData;
  const { info } = useSiteInfo;
  const { formSubmit, field, values, errors } = useForm({
    values: doc,
  });

  const fn = (values, submitter) => {
    console.log('submit', submitter.name, values);
  };
  const callbackHandler = (values) => {
    console.log('callback', values);
  };
  const inputHandler = (ev) => {
    const el = ev.target;
    console.log('input', el.name, el.value);
  };
  return (
    <Show when={!readStatus.loading} fallback={<div>Leyendo ....</div>}>
      <form id="form" use:formSubmit={fn}>
        <div class="form-top">
          <div>
            <label>
              Título
              <input
                name="title"
                class="text-input wide"
                title="Título de la página o post"
                tabindex="1"
                required
                value={values.title}
                use:field
                onInput={inputHandler}
              />
              <ErrorMessage error={errors.title} />
            </label>
            <label>
              Fecha
              <input
                name="date"
                type="date"
                class="text-input"
                title="Fecha de publicación"
                value={values.date?.split('T')[0] ?? today}
                use:field
                onInput={inputHandler}
              />
              <ErrorMessage error={errors.date} />
            </label>
            <Show when={doc.isPost}>
              <SplitSelList
                name="cats"
                title="Categorías"
                items={info.categories}
                selected={values.categories}
                callback={callbackHandler}
              ></SplitSelList>
              <SplitSelList
                name="tags"
                title="Etiquetas"
                items={info.tags}
                selected={values.tags}
                callback={callbackHandler}
              ></SplitSelList>

              <label>
                Autor
                <input
                  name="author"
                  class="text-input wide"
                  title="Ingresa o selecciona el nombre del autor"
                  list="authorDatalist"
                  value={values.author}
                  use:field
                  onInput={inputHandler}
                />
                <ErrorMessage error={errors.author} />
              </label>
              <datalist id="authorDatalist">
                <For each={info.authors}>
                  {(item) => <option value={item} />}
                </For>
              </datalist>
            </Show>
          </div>
          <div>
            <fieldset>
              <legend>Original</legend>
              {/* //   els.publish.disabled = !fileName || isChanged; */}
              <button
                name="publish"
                type="submit"
                title="Guarda este borrador como original para publicar"
                disabled={!doc.fileName || isChanged()}
              >
                <Icon>save</Icon>
                Guardar
              </button>
              <button
                name="remove"
                type="submit"
                class="warning"
                title="Borra este borrador y el original"
                disabled={doc.isNew || doc.fileName === 'index.md'}
              >
                <Icon>delete</Icon>
                Borrar
              </button>
            </fieldset>
            <fieldset>
              <legend>Borrador</legend>
              <button
                name="save"
                type="submit"
                title="Guarda el borrador sin afectar el original"
                disabled={!isChanged()}
              >
                <Icon>save</Icon>
                Guardar
              </button>
              <button
                name="discard"
                type="submit"
                class="warning"
                title="Descarta este borrador sin afectar el original"
                disabled={!doc.isDraft}
              >
                <Icon>delete</Icon>
                Descartar
              </button>
            </fieldset>
            <button type="reset" title="Vuelve a la selección de archivos">
              <Icon>back</Icon>
              Volver
            </button>
          </div>
        </div>
        <SunEditor
          name="contents"
          contents={values.contents}
          onInput={inputHandler}
        />
      </form>
    </Show>
  );
}

export default Editor;
