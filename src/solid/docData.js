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
  const resetDoc = (overrides) => setDoc({ ...defaultValues, ...overrides });

  const url = (draft) =>
    join(ROUTES.FILES, !!(draft ?? doc.isDraft), !!doc.isPost, doc.fileName);

  const readMd = async (_, { refetching }) => {
    if (typeof refetching === 'object') {
      resetDoc(refetching);
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

  const [readStatus, { refetch: readDoc }] = createResource(readMd, {
    initialValue: defaultValues,
  });

  createEffect(() => {
    if (readStatus.state === 'ready') {
      setDoc(reconcile(readStatus()));
    }
  });

  const [saveStatus, { refetch: saveDoc }] = createResource(
    (_, { refetching }) => {
      if (refetching)
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
    }
  );

  const [removeStatus, { refetch: removeDoc }] = createResource(
    async (_, { refetching }) => {
      if (refetching) {
        if (doc.isDraft) await deleteFile(url(true));
        if (refetching === 'both') {
          await deleteFile(url(false));
        }
        resetDoc();
      }
    }
  );

  return {
    doc,
    setDoc,
    resetDoc,
    readDoc,
    readStatus,
    saveDoc,
    saveStatus,
    removeDoc,
    removeStatus,
  };
});
