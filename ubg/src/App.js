import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './pages/Home';
import Game from './pages/Game';
import Room from './pages/Room'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home/>
        </Route>
        <Route exact path="/:gameId">
          <Game/>
        </Route>
        <Route exact path="/:gameId/:roomId">
          <Room/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
