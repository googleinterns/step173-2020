import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import Review from './Review';
import pretty from 'pretty';

let container = null;
const reviewOne = {
  name: 'John Smith',
  rating: '8',
  text: 'This game is good!',
};
const reviewTwo = {
  name: 'Stephanie Soo',
  rating: '10',
};

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

it('renders name and text', () => {
  act(() => {
    render(<Review review={reviewOne} />, container);
  });
  expect(container.textContent).toBe(reviewOne.name + reviewOne.text);
});

it('renders review with no text', () => {
  act(() => {
    render(<Review review={reviewTwo} />, container);
  });
  expect(container.textContent).toBe(reviewTwo.name);
});

it('should render a review', () => {
  act(() => {
    render(<Review review={reviewOne} />, container);
  });

  expect(pretty(container.innerHTML)).toMatchInlineSnapshot();
});