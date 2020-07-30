// import React, {Suspense} from 'react';
// import {unmountComponentAtNode} from 'react-dom';
// //import {render, screen} from '@testing-library/react';
// import { act } from "react-dom/test-utils";
// import AllReviews from './AllReviews.js';
// import {FirebaseAppProvider} from 'reactfire';
import { render, waitForElement, cleanup, act } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';
import * as firebase from '@firebase/testing';

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
const gameId = '102794';
const user = {
 uid: 123,
 displayName: 'John Smith',
};
const reviewObject = {
 name: user.displayName,
 rating: 8,
 text: 'Great game!',
 timestamp: Date.now(),
 userId: user.uid,
};
const reviews = [
  {
    name: 'Shandy Kim',
    rating: 8,
    text: 'Great game!',
    timestamp: Date.now(),
    userId: 123,
  },
  {
    name: 'Shiyue Zhang',
    rating: 2,
    text: 'This game sucks!',
    timestamp: Date.now(),
    userId: 456,
  },
  {
    name: 'Daniel Trevino',
    rating: 10,
    text: '',
    timestamp: Date.now(),
    userId: 789,
  },
 ];

const handleAddReviewMock = jest.fn(reviewObject => {});
const signInMock = jest.fn(() => [true, false]);
let container = null;

describe('Firestore', () => {
  let app = null;

  beforeAll(async () => {
    app = firebase.initializeTestApp({
      projectId: '12345',
      databaseName: 'my-database',
      auth: { uid: 'alice' }
    });
  });

  afterEach(async () => {
    cleanup();
    await firebase.clearFirestoreData({ projectId: '12345' });
  });

  test('sanity check - emulator is running', async () => {
    return app
      .firestore()
      .collection('test')
      .add({ a: 'hello' });
  });
});
