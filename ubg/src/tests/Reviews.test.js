import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Reviews from "../reviews/Reviews";
import pretty from "pretty";

let container = null;
const reviewOne = {
  name: "John Smith",
  rating: "8",
  text: "This game is good!",
};
const reviewTwo = {
    name: "Jane Doe",
    rating: "5",
    text: "This game is decent, but it could be better.",
};
const reviewThree = {
    name: "Stephanie Soo",
    rating: "10",
};
//const reviewArr

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

// check if multiple comments are being rendered correctly
// check if no text review rendered correctly