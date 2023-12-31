import { Show, For } from 'solid-js';
import SunEditor from './SunEditor';
import Icon from './Icon';
import useDocData from './useDocData';
import useSiteInfo from './useSiteInfo';
import SplitSelList from './SplitSelList';
import { today } from './utils';
import Form from './Form';
import './Editor.css';

const ErrorMessage = (props) => (
  <Show when={props.error}>
    <span class="error-message">{props.error}</span>
  </Show>
);

export function Editor() {
  const { doc, docInfo, readStatus } = useDocData;
  const { info } = useSiteInfo;

  const fn = (values, submitter) => {
    console.log('submit', submitter.name, values);
  };

  return (
    <Show when={!readStatus.loading} fallback={<div>Leyendo ....</div>}>
      <Form id="form" values={doc} submitHandler={fn}>
        {(form) => {
          const { values, errors, touched } = form;
          return (
            <>
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
                    />
                    <ErrorMessage error={errors.date} />
                  </label>
                  <Show when={docInfo.isPost}>
                    <SplitSelList
                      name="cats"
                      title="Categorías"
                      items={info.categories}
                      form={form}
                    ></SplitSelList>
                    <SplitSelList
                      name="tags"
                      title="Etiquetas"
                      items={info.tags}
                      form={form}
                    ></SplitSelList>

                    <label>
                      Autor
                      <input
                        name="author"
                        class="text-input wide"
                        title="Ingresa o selecciona el nombre del autor"
                        list="authorDatalist"
                        value={values.author}
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
                    <button
                      name="publish"
                      type="submit"
                      title="Guarda este borrador como original para publicar"
                      disabled={!docInfo.fileName || touched.$any}
                    >
                      <Icon>save</Icon>
                      Guardar
                    </button>
                    <button
                      name="remove"
                      type="submit"
                      class="warning"
                      title="Borra este borrador y el original"
                      disabled={
                        docInfo.isNew || docInfo.fileName === 'index.md'
                      }
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
                      disabled={!touched.$any}
                    >
                      <Icon>save</Icon>
                      Guardar
                    </button>
                    <button
                      name="discard"
                      type="submit"
                      class="warning"
                      title="Descarta este borrador sin afectar el original"
                      disabled={!docInfo.isDraft}
                    >
                      <Icon>delete</Icon>
                      Descartar
                    </button>
                  </fieldset>
                  <button
                    type="reset"
                    title="Vuelve a la selección de archivos"
                  >
                    <Icon>back</Icon>
                    Volver
                  </button>
                </div>
              </div>
              <SunEditor name="contents" form={form} />
            </>
          );
        }}
      </Form>
    </Show>
  );
}

export default Editor;
