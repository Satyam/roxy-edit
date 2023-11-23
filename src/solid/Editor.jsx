import { Show, For } from 'solid-js';
import SunEditor from './SunEditor';
import Icon from './Icon';
import { createStore } from 'solid-js/store';
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
  const { doc, readStatus } = useDocData;
  const { info } = useSiteInfo;
  const { validate, formSubmit, errors } = useForm({
    errorClass: 'error-input',
  });
  console.log(doc);

  const fn = (values, submitter) => {
    console.log('submit', submitter.name, values);
  };
  return (
    <Show when={!readStatus.loading} fallback={<div>Leyendo ....</div>}>
      <form id="form" use:formSubmit={fn}>
        <div>
          <label>
            Título
            <input
              name="title"
              class="text-input wide"
              title="Título de la página o post"
              tabindex="1"
              required
              value={doc.title}
              use:validate
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
              value={doc.date?.split('T')[0] ?? today}
              use:validate
            />
            <ErrorMessage error={errors.date} />
          </label>
          <Show when={doc.isPost}>
            <SplitSelList
              name="cats"
              title="Categorías"
              items={info.categories}
              selected={doc.categories}
            ></SplitSelList>
            <SplitSelList
              name="tags"
              title="Etiquetas"
              items={info.tags}
              selected={doc.tags}
            ></SplitSelList>

            <label>
              Autor
              <input
                name="author"
                class="text-input wide"
                title="Ingresa o selecciona el nombre del autor"
                list="authorDatalist"
                value={doc.author}
                use:validate
              />
              <ErrorMessage error={errors.author} />
            </label>
            <datalist id="authorDatalist">
              <For each={info.authors}>{(item) => <option value={item} />}</For>
            </datalist>
          </Show>
        </div>
        <div>
          <fieldset>
            <legend>Original</legend>
            <button
              name="publish"
              type="submit"
              title="Guarda este borrador como original para publicar"
            >
              <Icon>save</Icon>
              Guardar
            </button>
            <button
              name="remove"
              type="submit"
              class="warning"
              title="Borra este borrador y el original"
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
            >
              <Icon>save</Icon>
              Guardar
            </button>
            <button
              name="discard"
              type="submit"
              class="warning"
              title="Descarta este borrador sin afectar el original"
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
      </form>

      <SunEditor contents={doc.contents} />
    </Show>
  );
}

export default Editor;
