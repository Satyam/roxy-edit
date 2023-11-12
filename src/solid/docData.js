import { createRoot, createResource, createEffect } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { today, join } from './utils';
import YAML from 'yaml';
import { deleteFile, fetchText, sendText } from '../fetch';
import { ROUTES } from '../common';

const defaultValues = {
  title: '',
  date: today,
  categories: [],
  tags: [],
  author: 'Roxana Cabut',
  contents: '',
  fileName: null,
  isPost: false,
  isDraft: false,
  isNew: false,
  isChanged: false,
};

const sepRx = /^---\n(?<fm>.*)\n---\s*(?<contents>.*)$/s;

export default createRoot(() => {
  const [doc, setDoc] = createStore(defaultValues);
  const resetDoc = () => setDoc(defaultValues);

  const url = (draft) =>
    join(ROUTES.FILES, !!(draft ?? doc.isDraft), !!doc.isPost, doc.fileName);

  const readMd = async () => {
    if (doc.fileName) {
      const md = await fetchText(url());
      const m = md.match(sepRx);
      if (!m) return m;
      const { fm, contents } = m.groups;
      const matter = YAML.parse(fm);
      console.log(matter);
      return {
        ...matter,
        contents,
      };
    }
    return defaultValues;
  };

  const [resource, { refetch }] = createResource(readMd, {
    storage: () => [() => doc, (getter) => setDoc(reconcile(getter()))],
    initialValue: defaultValues,
  });

  createEffect(() => {
    console.log('fetch:', resource.state);
  });

  const removeMd = async (both = false) => {
    if (doc.isDraft) await deleteFile(url(true));
    if (both) {
      await deleteFile(url(false));
    }
  };

  const saveMd = async () =>
    sendText(
      url(),
      // Leave no blank spaces to the left of this template string:
      `---
${YAML.stringify({
  title: doc.title,
  date: doc.date,
  categories: doc.categories,
  tags: doc.tags,
  author: doc.author,
})}
---
${doc.contents}`
    );

  return { doc, setDoc, resetDoc, fetchMd: refetch, removeMd, saveMd };
});
