import { For, createMemo } from 'solid-js';
import { unwrap } from 'solid-js/store';
import useSiteInfo from './useSiteInfo';
import useDocData from './useDocData';
import { activeTabSignal, TABS } from './activeTab';
import './ListPosts.css';

export const sortDescending = (a, b) => b[0] - a[0];

export function ListPosts() {
  const { info } = useSiteInfo;
  const [_, setActiveTab] = activeTabSignal;
  const { readDoc } = useDocData;
  const drafts = createMemo(() => info.drafts);

  const tree = createMemo(() => {
    const tNode = {};
    unwrap(info.posts).forEach((p) => {
      p.borrador = drafts().some((d) => d.file === p.file);
      const [y, m, d] = p.date.split('-');
      if (!(y in tNode)) tNode[y] = {};
      const yNode = tNode[y];
      if (!(m in yNode)) yNode[m] = {};
      const mNode = yNode[m];
      if (!(d in mNode)) mNode[d] = [];
      mNode[d].push(p);
    });
    return tNode;
  });

  const clickHandler = ({ file }, ev) => {
    ev.preventDefault();
    readDoc({ fileName: file, isPost: true });
    setActiveTab(TABS.EDITOR);
  };

  return (
    <div class="posts-list">
      <For each={Object.entries(tree()).sort(sortDescending)}>
        {([y, yNode]) => (
          <details>
            <summary>{y}</summary>
            <For each={Object.entries(yNode).sort(sortDescending)}>
              {([m, mNode]) => (
                <details>
                  <summary>{m}</summary>
                  <For each={Object.entries(mNode).sort(sortDescending)}>
                    {([d, dNode]) => (
                      <details>
                        <summary>{d}</summary>
                        <p>{`${d}/${m}/${y}`}</p>
                        <ul>
                          <For each={dNode.sort()}>
                            {(page) =>
                              page.borrador ? (
                                <li
                                  class="can-t-edit"
                                  title="Está en Borradores"
                                >
                                  {page.title}
                                </li>
                              ) : (
                                <li>
                                  <a
                                    href={page.file}
                                    onClick={[clickHandler, page]}
                                  >
                                    {page.title}
                                  </a>
                                </li>
                              )
                            }
                          </For>
                        </ul>
                      </details>
                    )}
                  </For>
                </details>
              )}
            </For>
          </details>
        )}
      </For>
    </div>
  );
}

export default ListPosts;
