import { For, createMemo } from 'solid-js';
import { useData } from './DataContext';
import Icon from './Icon';

export function ListPages() {
  const [data] = useData();

  const drafts = createMemo(() => data.drafts);
  const home = createMemo(() => data.pages[0]);
  const p = createMemo(() =>
    data.pages
      .slice(1)
      .sort((a, b) => {
        if (a.title > b.title) return 1;
        if (a.title < b.title) return -1;
        return 0;
      })
      .map((p) => ({
        ...p,
        borrador: drafts().some((d) => d.file === p.file),
      }))
  );

  return (
    <div>
      <p>
        <Icon name="home" />
        <a href={home().file}>{home().title}</a>
      </p>
      <ul>
        <For each={p()}>
          {(page) =>
            page.borrador ? (
              <li class="can-t-edit" title="Está en Borradores">
                {page.title}
              </li>
            ) : (
              <li>
                <a href={page.file}>{page.title}</a>
              </li>
            )
          }
        </For>
      </ul>
    </div>
  );
}

export default ListPages;
