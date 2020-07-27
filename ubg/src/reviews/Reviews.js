import React from 'react';
import Review from './Review';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';

/**
 * Renders all reviews for a game page
 * @return {ReactElement} List with ListItems of reviews
 */
export default class Reviews extends React.Component {
  /**
   * Returns a single, formatted review
   * @param {*} review Object containing review info
   * @return {ReactElement} Single, formatted review
   */
  renderReview(review) {
    return <Review review={review} />;
  }

  /**
   * Renders all formatted reviews from most to least recent
   * @return {ReactElement} List with ListItems of reviews
   */
  render() {
    return (
      // iterate through all reviews
      <div>
        <List width="100%">
          {Array.from(this.props.reviews).map((review) => {
            return this.renderReview(review);
          })}
        </List>
      </div>
    );
  }
}

Reviews.propTypes = {
  reviews: PropTypes.object,
};

