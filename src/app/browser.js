import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { App } from './index';

hydrate(
  <BrowserRouter>
    <App serverData={window.__APP_INITIAL_STATE__} />
  </BrowserRouter>,
  document.getElementById('root')
);
