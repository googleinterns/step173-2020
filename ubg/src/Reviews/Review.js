import React from 'react';

// Returns one formatted review
const Review = props => {
    return (
      <div>
        <h6>{props.review.name}</h6>
        <p>Rating: {props.review.rating}</p>
        <p> {props.review.text} </p>
        <hr />
      </div>
    );
  };
  
  export default Review;
