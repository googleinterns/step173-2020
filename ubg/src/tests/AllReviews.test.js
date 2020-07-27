import {unmountComponentAtNode} from 'react-dom';

let container = null;

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

// test if reviews loaded from database at beginning
// test that handleAddReview adding to local reviews array
// test that handleAddReview adding to database new review
// check that all elements are there on document
// test that reviews section updated to include new review
// AuthCheck that correct section shows
