import { sortDescending, slugify, today, onClick } from './utils';
import { setDataLists, setForm, acceptChanges } from './form';
import { readMd, removeMd, saveMD } from './files';
import { renderTpl } from './tpl';
import {
  getDrafts,
  addPostInfo,
  addDraftInfo,
  removeDraftInfo,
  removePostInfo,
  updateProps,
  uniqueFileName,
} from './data';

import {
  fileName,
  isDraft,
  isPost,
  isNew,
  setFileName,
  setMdType,
} from './state';

import { replaceImages } from './images';

import { EVENT, on } from './events';

import { pagesList, postsList } from './lists';

const CNAMES = {
  PAGE_LIST: 'page-list',
  POST_LIST: 'post-list',
  DRAFT_POST_LIST: 'draft-post-list',
  DRAFT_PAGE_LIST: 'draft-page-list',
  EDIT: 'edit',
  SELECT: 'select',
};

const divFileList = document.getElementById('fileList');
const main = document.getElementById('main');

const btnDraftPage = document.querySelector('button[name="draftPage"]');
const btnDraftPost = document.querySelector('button[name="draftPost"]');
const setDraftButtons = () => {
  btnDraftPage.disabled = !getDrafts(false).length;
  btnDraftPost.disabled = !getDrafts(true).length;
};

export const clearSelect = () => {
  divFileList.innerHTML = '';
  divFileList.className = '';
  setDraftButtons();
  main.className = CNAMES.SELECT;
};

const setFileList = (className, contents) => {
  divFileList.className = className;
  divFileList.innerHTML = contents;
};

export const selectInit = () => {
  clearSelect();
  setDataLists();
};

on(EVENT.SAVE, async ({ matter }) => {
  matter.updated = today;
  setMdType(isPost, true, isNew);
  if (isPost) {
    matter.layout = 'post';
    if (await updateProps(matter)) {
      setDataLists();
    }
    if (!fileName)
      setFileName(uniqueFileName(`${matter.date}-${slugify(matter.title)}`));
  } else {
    matter.layout = 'page';
    if (!fileName) setFileName(uniqueFileName(slugify(matter.title)));
  }
  const contents = await replaceImages();
  await saveMD(matter, contents);
  await addDraftInfo({ title: matter.title, date: today });
  acceptChanges();
});

on(EVENT.REMOVE, async () => {
  await removeMd(true);
  await removePostInfo();
  await removeDraftInfo();
  clearSelect();
});

on(EVENT.PUBLISH, async ({ matter, contents }) => {
  setMdType(isPost, false, isNew);
  await saveMD(matter, contents);
  if (isNew) {
    await addPostInfo({
      file: fileName,
      title: matter.title,
      date: matter.date,
    });
  }
  await removeDraftInfo();
  await removeMd();
  clearSelect();
});

on(EVENT.DISCARD, async () => {
  await removeMd(false);
  await removeDraftInfo();
  clearSelect();
  acceptChanges();
});

on(EVENT.RESET, () => {
  clearSelect();
  acceptChanges();
});

onClick(
  '#selectButtons',
  (el) => {
    switch (el.name) {
      case 'newPage':
        main.className = CNAMES.EDIT;
        setMdType(false, true, true);
        setFileName();
        setForm();
        break;

      case 'newPost':
        main.className = CNAMES.EDIT;
        setMdType(true, true, true);
        setFileName();
        setForm();
        break;

      case 'editPage':
        const drafts = getDrafts();
        setFileList(CNAMES.PAGE_LIST, pagesList());
        setMdType(false);
        break;

      case 'draftPage':
        setFileList(
          CNAMES.DRAFT_PAGE_LIST,
          renderTpl('tplDraftsList', {
            pages: getDrafts().sort(sortDescending),
          })
        );
        setMdType(false, true);
        break;

      case 'draftPost':
        setFileList(
          CNAMES.DRAFT_POST_LIST,
          renderTpl('tplDraftsList', {
            pages: getDrafts(true).sort(sortDescending),
          })
        );
        setMdType(true, true);
        break;

      case 'editPost':
        setFileList(CNAMES.POST_LIST, postsList());
        setMdType(true);
        break;
    }
  },
  'button'
);

onClick(
  divFileList,
  async (aEl) => {
    setFileName(aEl.getAttribute('href'));
    if ('isNew' in aEl.dataset) {
      setMdType(isPost, isDraft, true);
    }

    const { matter, content } = await readMd();

    setForm(matter, content);
    main.className = CNAMES.EDIT;
  },
  'a'
);
