import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import App from './App';

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container!);

root.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>,
);
