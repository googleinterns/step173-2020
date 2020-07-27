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
const reviewTwo = {
  name: "Stephanie Soo",
  rating: "10",
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

it("renders name and text", () => {
  //const review = getByTestId("review");
  act(() => {
    render(<Review review={reviewOne} />, container);
  });
  //expect(review).toBeInTheDocument();
  expect(container.textContent).toBe(reviewOne.name + reviewOne.text);
});

it("renders review with no text", () => {
  act(() => {
    render(<Review review={reviewTwo} />, container);
  });
  expect(container.textContent).toBe(reviewTwo.name);
});

it("should render a review", () => {
  act(() => {
    render(<Review review={reviewOne} />, container);
  });

  expect(pretty(container.innerHTML)).toMatchInlineSnapshot(`
    "<div>
      <li class=\\"MuiListItem-root MuiListItem-gutters MuiListItem-alignItemsFlexStart\\" data-testid=\\"review\\">
        <div class=\\"MuiListItemText-root MuiListItemText-multiline\\"><span class=\\"MuiTypography-root makeStyles-fonts-2 MuiTypography-body1\\">John Smith</span>
          <p class=\\"MuiTypography-root MuiListItemText-secondary MuiTypography-body2 MuiTypography-colorTextSecondary MuiTypography-displayBlock\\"><span class=\\"MuiRating-root MuiRating-readOnly\\" role=\\"img\\" aria-label=\\"8 Stars\\"><span><span class=\\"MuiRating-icon MuiRating-iconFilled\\"><svg class=\\"MuiSvgIcon-root MuiSvgIcon-fontSizeInherit\\" focusable=\\"false\\" viewBox=\\"0 0 24 24\\" aria-hidden=\\"true\\"><path d=\\"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\\"></path></svg></span></span><span><span class=\\"MuiRating-icon MuiRating-iconFilled\\"><svg class=\\"MuiSvgIcon-root MuiSvgIcon-fontSizeInherit\\" focusable=\\"false\\" viewBox=\\"0 0 24 24\\" aria-hidden=\\"true\\"><path d=\\"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\\"></path></svg></span></span><span><span class=\\"MuiRating-icon MuiRating-iconFilled\\"><svg class=\\"MuiSvgIcon-root MuiSvgIcon-fontSizeInherit\\" focusable=\\"false\\" viewBox=\\"0 0 24 24\\" aria-hidden=\\"true\\"><path d=\\"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\\"></path></svg></span></span><span><span class=\\"MuiRating-icon MuiRating-iconFilled\\"><svg class=\\"MuiSvgIcon-root MuiSvgIcon-fontSizeInherit\\" focusable=\\"false\\" viewBox=\\"0 0 24 24\\" aria-hidden=\\"true\\"><path d=\\"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\\"></path></svg></span></span><span><span class=\\"MuiRating-icon MuiRating-iconFilled\\"><svg class=\\"MuiSvgIcon-root MuiSvgIcon-fontSizeInherit\\" focusable=\\"false\\" viewBox=\\"0 0 24 24\\" aria-hidden=\\"true\\"><path d=\\"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\\"></path></svg></span></span><span><span class=\\"MuiRating-icon MuiRating-iconFilled\\"><svg class=\\"MuiSvgIcon-root MuiSvgIcon-fontSizeInherit\\" focusable=\\"false\\" viewBox=\\"0 0 24 24\\" aria-hidden=\\"true\\"><path d=\\"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\\"></path></svg></span></span><span><span class=\\"MuiRating-icon MuiRating-iconFilled\\"><svg class=\\"MuiSvgIcon-root MuiSvgIcon-fontSizeInherit\\" focusable=\\"false\\" viewBox=\\"0 0 24 24\\" aria-hidden=\\"true\\"><path d=\\"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\\"></path></svg></span></span><span><span class=\\"MuiRating-icon MuiRating-iconFilled\\"><svg class=\\"MuiSvgIcon-root MuiSvgIcon-fontSizeInherit\\" focusable=\\"false\\" viewBox=\\"0 0 24 24\\" aria-hidden=\\"true\\"><path d=\\"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\\"></path></svg></span></span><span><span class=\\"MuiRating-icon MuiRating-iconEmpty\\"><svg class=\\"MuiSvgIcon-root MuiSvgIcon-fontSizeInherit\\" focusable=\\"false\\" viewBox=\\"0 0 24 24\\" aria-hidden=\\"true\\"><path d=\\"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\\"></path></svg></span></span><span><span class=\\"MuiRating-icon MuiRating-iconEmpty\\"><svg class=\\"MuiSvgIcon-root MuiSvgIcon-fontSizeInherit\\" focusable=\\"false\\" viewBox=\\"0 0 24 24\\" aria-hidden=\\"true\\"><path d=\\"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\\"></path></svg></span></span></span><br><span class=\\"MuiTypography-root MuiTypography-body1\\">This game is good!</span></p>
        </div>
      </li>
      <hr class=\\"MuiDivider-root\\">
    </div>"
  `);
});
