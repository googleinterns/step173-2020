import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Review from "../reviews/Review";
import pretty from "pretty";

let container = null;
const reviewOne = {
  name: "John Smith",
  rating: "8",
  text: "This game is good!",
};

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

// test if new review section is being rendered correctly
// test if alert pops up if no rating selected
// test that onSubmit triggers addReview
// test if input field has been cleared
