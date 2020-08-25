import React from 'react';
import Review from './Review';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import * as firebase from 'firebase/app';

/**
 * Renders all reviews for a game page
 * @param {object} reviews
 * @param {boolean} profile
 * @return {ReactElement} List with ListItems of reviews
 */
export default function Reviews({reviews, profile, reviewsRef=null,
  usersDoc=null, setInitialize=null, setReviewed=null, uid=null}) {
  /**
   * @param {object} review
   * delete comment
   */
  function deleteComment(review) {
    reviewsRef.doc(review.reviewId).delete();
    usersDoc.update({
      reviews: firebase.firestore.FieldValue.arrayRemove(review.reviewData),
    });
    setInitialize(false);
    setReviewed(false);
  }
  /**
   * Renders all formatted reviews from most to least recent
   * @return {ReactElement} List with ListItems of reviews
   */
  return (
    // iterate through all reviews
    <div>
      <List width="100%">
        {Array.from(reviews).map((review) => {
          let editDelete = null;
          if (profile) {
            review = {...review, name: review.gameName};
          } else if (review.userId === uid) {
            editDelete = <Button
              variant="contained"
              color="secondary"
              onClick={()=>deleteComment(review)}
            >
                Delete
            </Button>;
          }
          return <div key={review.name + review.timestamp}>
            <Review review={review}/>
            {editDelete}
          </div>;
        })}
      </List>
    </div>
  );
}

Reviews.propTypes = {
  reviews: PropTypes.array,
  profile: PropTypes.bool,
  reviewsRef: PropTypes.object,
  usersDoc: PropTypes.object,
  setInitialize: PropTypes.func,
  setReviewed: PropTypes.func,
  uid: PropTypes.string,
};
