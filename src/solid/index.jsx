/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import { DataProvider } from './DataContext';

const root = document.getElementById('root');

render(
  () => (
    <DataProvider>
      <App />
    </DataProvider>
  ),
  root
);
