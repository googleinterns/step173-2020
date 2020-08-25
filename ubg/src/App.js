import React, {Suspense} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Search from './pages/Search';
import Room from './pages/Room';
import Profile from './pages/Profile';
import About from './pages/About';
import NotFound from './pages/NotFound';
import {FirebaseAppProvider} from 'reactfire';
import {Provider} from 'react-redux';
import store from './redux/store';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

/**
 * @return {ReactElement} UltimateBoardGame website
 */
function App() {
  return (
    <Provider store={store}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <Suspense fallback={<p>loading...</p>}>
          <Router>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/search">
                <Search />
              </Route>
              <Route exact path="/about">
                <About />
              </Route>
              <Route exact path="/search/:query">
                <Search />
              </Route>
              <Route exact path="/profile">
                <Profile />
              </Route>
              <Route exact path="/:gameId">
                <Game />
              </Route>
              <Route exact path="/gameRoom/:roomId">
                <Room />
              </Route>
              
              <Route path="/">
                <NotFound />
              </Route>
            </Switch>
          </Router>
        </Suspense>
      </FirebaseAppProvider>
    </Provider>
  );
}

export default App;
