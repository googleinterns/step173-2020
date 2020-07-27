import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Review from "../reviews/Review";
import pretty from "pretty";

let container = null;
const test = require('firebase-functions-test')();
const functions = require('firebase-functions');
const key = functions.config().stripe.key;
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

// test if reviews loaded from database at beginning
// test that handleAddReview adding to local reviews array
// test that handleAddReview adding to database new review
// check that all elements are there on document
// test that reviews section updated to include new review
// AuthCheck that correct section shows
