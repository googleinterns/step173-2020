import React from 'react';
import {unmountComponentAtNode} from 'react-dom';
import {render, fireEvent} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import NewReview from './NewReview.js';
import TestUtils from 'react-dom/test-utils';
import { initializeApp } from 'firebase';
 
// const admin = require('firebase-admin');
// admin.initializeApp();
const gameId = 102794;
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
const handleAddReviewMock = jest.fn(reviewObject => {});
let container = null;
// const newReview = require('./addReview');
// const update = jest.fn();
// const doc = jest.fn(() => ({update}));
const doc = jest.fn();
// const collection = jest.spyOn(admin.firestore(), 'collection').mockReturnValue({doc});
// const addReview = jest.spyOn(newReview, 'addReview');
// firebase.auth().currentUser
 
beforeEach(() => {
 // setup a DOM element as a render target
 container = document.createElement('div');
 document.body.appendChild(container);
});
 
afterEach(() => {
 // cleanup on exiting
 unmountComponentAtNode(container);
 container.remove();
 container = null;
});

it('renders without crashing', () => {
  render(<NewReview gameId={gameId} handleAddReview={handleAddReviewMock} user={user}/>, container);
})

// it("submits", () => {
//   const addReviewMock = jest.fn(() => (handleAddReviewMock));
//   render(
//     <NewReview gameId={gameId} handleAddReview={addReviewMock} user={user} />,
//     container
//   );
//   const reviewInput = container.querySelector('Rating name="rating"');
//   //const textInput = container.querySelector('TextField');
//   const form = container.querySelector('form');
//   // TestUtils.Simulate.change(reviewInput, { target: { value: { elements: { rating: { value:
//   //   '7'
//   // } } } } });
//   //TestUtils.Simulate.submit(form);
//   //expect(addReviewMock).toHaveBeenCalledTimes(1);
//   //expect(addReviewMock.mock.results[0].value).toEqual({ 'first_name': 'Peter Parker' });
//   //fireEvent.submit(getByTestId('form'));
//   //expect(handleAddReviewMock()).toHaveBeenCalled();
// });
 
// it('renders new review section correctly', () => {
//  act(() => {
//    render(<NewReview gameId={gameId} handleAddReview={handleAddReviewMock} user={user}/>, container);
//  });
//  expect();
//  // check if handleaddreview had been called n times
//  // handleAddReviewMock.mock.calls()
//  //expect(handleAddReviewMock).toHaveBeenCalled();
//  //expect(handleAddReviewMock.mock.calls()[0][]0).equals()whatever
// })
 
// it ('fires alert if no rating', () => {
//   const addReviewMock = jest.fn(() => (handleAddReviewMock));
//   render(
//     <NewReview gameId={gameId} handleAddReview={addReviewMock} user={user} />,
//     container
//   );
//   // somehow try to submit review
//   global.alert = jest.fn();
//   //expect(global.alert).toHaveBeenCalledTimes(1);
// })
 
// test if new review section is being rendered correctly
// test if alert pops up if no rating selected
// test that onSubmit triggers addReview
// test if input field has been cleared
 
