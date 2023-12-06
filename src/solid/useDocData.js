import { createRoot, createResource, createEffect } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { today, join } from './utils';
import YAML from 'yaml';
import { deleteFile, fetchText, sendText } from '../fetch';
import { ROUTES } from '../common';

const defaultDoc = {
  title: '',
  date: today,
  categories: [],
  tags: [],
  author: 'Roxana Cabut',
  contents: '',
};
const defaultDocInfo = {
  fileName: null,
  isPost: false,
  isDraft: false,
  isNew: false,
  isChanged: false,
};

const sepRx = /^---\n(?<fm>.*)\n---\s*(?<contents>.*)$/s;

export default createRoot(() => {
  const [doc, setDoc] = createStore(defaultDoc);
  const [docInfo, setDocInfo] = createStore(defaultDocInfo);
  const resetStatus = (overrides) =>
    setDocInfo({ ...defaultDocInfo, ...overrides });

  const url = (draft) =>
    join(
      ROUTES.FILES,
      !!(draft ?? docInfo.isDraft),
      !!docInfo.isPost,
      docInfo.fileName
    );

  const readMd = async (_, { refetching }) => {
    if (typeof refetching === 'object') {
      resetStatus(refetching);
      const md = await fetchText(url());
      const m = md.match(sepRx);
      if (!m) return m;
      const { fm, contents } = m.groups;
      const matter = YAML.parse(fm);
      console.log(matter);
      return {
        ...doc,
        ...matter,
        contents,
      };
    }
    return defaultDoc;
  };

  const [readStatus, { refetch: readDoc }] = createResource(readMd, {
    initialValue: defaultDoc,
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
${YAML.stringify(
  docInfo.isPost
    ? {
        layout: 'post',
        title: doc.title,
        date: doc.date,
        categories: doc.categories,
        tags: doc.tags,
        author: doc.author,
      }
    : {
        layout: 'page',
        title: doc.title,
        date: doc.date,
      }
)}
---
${doc.contents}`
        );
    }
  );

  const [removeStatus, { refetch: removeDoc }] = createResource(
    async (_, { refetching }) => {
      if (refetching) {
        if (docInfo.isDraft) await deleteFile(url(true));
        if (refetching === 'both') {
          await deleteFile(url(false));
        }
        setDocInfo(defaultDocInfo);
        setDoc(defaultDoc);
      }
    }
  );

  return {
    doc,
    docInfo,
    readDoc,
    readStatus,
    saveDoc,
    saveStatus,
    removeDoc,
    removeStatus,
  };
});
