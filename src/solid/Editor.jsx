import { Show, For } from 'solid-js';
import SunEditor from './SunEditor';
import Icon from './Icon';
import { createStore } from 'solid-js/store';
import docData from './docData';
import siteInfo from './siteInfo';
import SplitSelList from './SplitSelList';
import { today } from './utils';

import './Editor.css';
const [values, setValues] = createStore({});
const [errors, setErrors] = createStore({});

function checkValid({ element, validators = [] }, setErrors, errorClass) {
  return async () => {
    element.setCustomValidity('');
    element.checkValidity();
    let message = element.validationMessage;
    if (!message) {
      for (const validator of validators) {
        const text = await validator(element);
        if (text) {
          element.setCustomValidity(text);
          break;
        }
      }
      message = element.validationMessage;
    }
    if (message) {
      errorClass && element.classList.toggle(errorClass, true);
      setErrors({ [element.name]: message });
    }
  };
}
export function Editor(props) {
  const { doc } = docData;
  const { info } = siteInfo;
  console.log(doc);
  // return <pre>{JSON.stringify(doc, null, 2)}</pre>;

  return (
    <>
      <form id="form" novalidate>
        <div>
          <label>
            Título
            <input
              name="title"
              class="text-input wide"
              title="Título de la página o post"
              tabindex="1"
              value={doc.title}
            />
            <div class="error"></div>
          </label>
          <label>
            Fecha
            <input
              name="date"
              type="date"
              class="text-input"
              title="Fecha de publicación"
              value={doc.date ?? today}
            />
            <div class="error"></div>
          </label>
          <Show when={doc.isPost}>
            <SplitSelList
              title="Categorías"
              items={info.categories}
              selected={doc.categories}
            ></SplitSelList>
            <SplitSelList
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
              />
              <div class="error"></div>
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
    </>
  );
}

export default Editor;
