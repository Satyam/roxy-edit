import { join } from './utils';
import { parse, stringify } from './frontmatter';
import { isPost, isDraft, fileName } from './state';
import { deleteFile, fetchText, sendText } from './fetch';
import { ROUTES } from '../common';
const url = (draft) =>
  join(ROUTES.FILES, !!(draft ?? isDraft), !!isPost, fileName);

export const readMd = async () => parse(await fetchText(url()));

export const removeMd = async (both = false) => {
  if (isDraft) await deleteFile(url(true));
  if (both) {
    await deleteFile(url(false));
  }
};

export const saveMD = async (matter, content) =>
  sendText(url(), stringify(matter, content));
