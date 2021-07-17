import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ListMovie from '../pages/movie-list';
import RegisterMovie from '../pages/movie-register';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={ListMovie}></Route>
      <Route path="/cadastro" component={RegisterMovie}></Route>
    </Switch>)
}