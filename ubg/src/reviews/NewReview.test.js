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

it('temp test', () => {
});

// test if new review section is being rendered correctly
// test if alert pops up if no rating selected
// test that onSubmit triggers addReview
// test if input field has been cleared
