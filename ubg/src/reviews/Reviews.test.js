import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Reviews from './Reviews';

let container = null;
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

it('renders text content of reviews', () =>{
  act(() => {
    render(<Reviews reviews={reviews} />, container);
  });
  expect(container.textContent).toBe(
    'Shandy KimGreat game!Shiyue Zhang' +
    'This game sucks!Daniel Trevino'
    );
});
