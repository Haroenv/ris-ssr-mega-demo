import { join } from 'path';
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import { App, routes } from './app';
import template from './template';

const server = express();

server.use('/assets', express.static(join(__dirname, 'assets')));

server.get('/*', (req, res) => {
  // @TODO: can we do something with this?
  const context = {};
  const ServerApp = props => (
    <StaticRouter location={req.url} context={context}>
      <App {...props} />
    </StaticRouter>
  );

  const promises = [];
  // use `some` to imitate `<Switch>` behavior of selecting only
  // the first to match
  routes.some(route => {
    const match = matchPath(req.path, route);
    if (match && typeof route.loadData === 'function') {
      promises.push(
        route.loadData(match, {
          App: ServerApp,
          url: req.url,
        })
      );
    }
    return match;
  });

  return Promise.all(promises).then(serverData => {
    const appString = renderToString(<ServerApp serverData={serverData} />);

    res.send(
      template({
        body: appString,
        title: 'Hello World from the server',
        serverData: JSON.stringify(serverData),
      })
    );
  });
});

server.listen(8080);

/* eslint-disable no-console */
console.log('listening on http://localhost:8080');
/* eslint-enable no-console */
