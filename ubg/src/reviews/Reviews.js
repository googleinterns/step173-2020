import React from 'react';
import Review from './Review';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';

/**
 * Renders all reviews for a game page
 * @param {object} reviews
 * @param {boolean} profile
 * @return {ReactElement} List with ListItems of reviews
 */
export default function Reviews({reviews, profile}) {
  /**
   * Renders all formatted reviews from most to least recent
   * @return {ReactElement} List with ListItems of reviews
   */
  return (
    // iterate through all reviews
    <div>
      <List width="100%">
        {Array.from(reviews).map((review) => {
          if (profile) {
            review = {...review, name: review.gameName};
          }
          return <Review review={review}
            key={review.name + review.timestamp}
          />;
        })}
      </List>
    </div>
  );
}

Reviews.propTypes = {
  reviews: PropTypes.array,
  profile: PropTypes.bool,
};
