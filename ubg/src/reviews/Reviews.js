import React from 'react';
import Review from './Review';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import * as firebase from 'firebase/app';
import {useUser} from 'reactfire';

/**
 * Renders all reviews for a game page
 * @param {object} reviews
 * @param {boolean} profile
 * @return {ReactElement} List with ListItems of reviews
 */
export default function Reviews({reviews, profile, reviewsRef=null,
  usersDoc=null, setInitialize=null, setReviewed=null}) {
  const user = useUser();
  /**
   * @param {object} review
   * delete comment
   */
  function deleteComment(review) {
    const activity = {
      type: 'review',
      uid: review.userId,
      timestamp: review.timestamp,
      displayName: review.name,
      game: review.reviewData.gameName,
    }
    reviewsRef.doc(review.reviewId).delete();
    usersDoc.doc(user.uid).update({
      reviews: firebase.firestore.FieldValue.arrayRemove(review.reviewData),
      activities: firebase.firestore.FieldValue.arrayRemove(activity),
    });
    // const reviewData
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
          } else if (user && review.userId === user.uid) {
            editDelete = <Button
              variant="outlined"
              color="secondary"
              onClick={()=>deleteComment(review)}
              size="small"
            >
                Delete
            </Button>;
          }
          return <div key={review.name + review.timestamp}>
            <Review review={review}/>
            {editDelete}
            <Divider />
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
};
