import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import Search from './Search';
import {FirebaseAppProvider} from 'reactfire';

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

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <Suspense fallback={<h1>Loading Home...</h1>}><Search /></Suspense>
    </FirebaseAppProvider>, div);
});
