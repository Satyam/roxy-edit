import { For, createMemo } from 'solid-js';
import Icon from './Icon';
import siteInfo from './siteInfo';
import docData from './docData';
import { activeTabSignal, TABS } from './activeTab';

export function ListPages() {
  const { info } = siteInfo;
  const [_, setActiveTab] = activeTabSignal;
  const { setDoc, resetDoc, readDoc } = docData;
  const drafts = createMemo(() => info.drafts);
  const home = createMemo(() => info.pages[0]);

  const p = createMemo(() =>
    info.pages
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

  const clickHandler = async ({ file, title }, ev) => {
    ev.preventDefault();
    resetDoc();
    setDoc({ fileName: file, title, isPost: false });
    readDoc();
    setActiveTab(TABS.EDITOR);
  };

  return (
    <div>
      <p>
        <Icon>home</Icon>
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
                <a href={page.file} onClick={[clickHandler, page]}>
                  {page.title}
                </a>
              </li>
            )
          }
        </For>
      </ul>
    </div>
  );
}

export default ListPages;
