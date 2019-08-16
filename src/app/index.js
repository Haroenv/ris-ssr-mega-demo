import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { route as searchRoute } from './views/Search';
import { route as homeRoute } from './views/Home';

export const routes = [homeRoute, searchRoute];

export const App = appProps => (
  <Switch>
    {routes.map(({ component: RouteComponent, ...route }, i) => (
      <Route
        {...route}
        render={props => <RouteComponent {...appProps} {...props} />}
        key={i}
      />
    ))}
  </Switch>
);
