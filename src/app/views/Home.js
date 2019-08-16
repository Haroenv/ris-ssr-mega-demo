import React from 'react';
import { Link } from 'react-router-dom';

export const Home = () => (
  <h1>
    Go to: <Link to="/search">search</Link>
  </h1>
);

export const route = {
  path: '/',
  exact: true,
  component: Home,
};
