import { For } from 'solid-js';
import { useData } from './DataContext';

export function ListPages() {
  const [data] = useData();

  const drafts = data.drafts;
  const [home, ...pages] = data.pages;
  const p = pages
    .toSorted((a, b) => {
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;
      return 0;
    })
    .map((p) => ({
      ...p,
      borrador: drafts.some((d) => d.file === p.file),
    }));

  return (
    <div>
      <p>
        <span class="icon-left home"></span>
        <a href={home.file}>{home.title}</a>
      </p>
      <ul>
        <For each={p}>
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
