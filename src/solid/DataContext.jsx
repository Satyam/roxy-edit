import { createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import { fetchJson, sendJson } from '../fetch';
import { ROUTES } from '../common';

export const DataContext = createContext();

export function DataProvider(props) {
  const [data, setStoredData] = createStore({
    pages: [],
    posts: [],
    categories: [],
    tags: [],
    authors: [],
    drafts: [],
  });

  const providerValue = [
    data,
    async (...newData) => {
      setStoredData(...newData);
      await sendJson(ROUTES.INFO, data);
    },
  ];
  fetchJson(ROUTES.INFO).then(setStoredData);
  return (
    <DataContext.Provider value={providerValue}>
      {props.children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
