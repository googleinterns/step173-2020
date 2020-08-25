import React, {useState, useEffect} from 'react';
import Box from '@material-ui/core/Box';
import Reviews from './Reviews';
import Typography from '@material-ui/core/Typography';
import {useFirestore} from 'reactfire';
import NewReview from './NewReview';
import {AuthCheck, useUser} from 'reactfire';
import PropTypes from 'prop-types';
import * as firebase from 'firebase/app';

/**
 * Displays the review section of a game page and handles review input
 * @param {string} gameId ID of current game on page
 * @return {ReactElement} Box containing review section
 */
function AllReviews({gameId}) {
  const user = useUser();
  const [reviews, setReviews] = useState([]);
  const [reviewed, setReviewed] = useState(false);
  const [initialize, setInitialize] = useState(false);
  const reviewsRef = useFirestore()
      .collection('gameReviews')
      .doc(gameId)
      .collection('reviews');
  const usersCollection = useFirestore().collection('users');
  const handleAddReview = (review) => {
    const tempReviews = [...reviews];
    tempReviews.unshift(review);
    setReviews(tempReviews);
    // let reviewed = false;
    // reviewsRef.get()
    //     .then(function(querySnapshot) {
    //       querySnapshot.forEach(function(doc) {
    //         if (doc.data()['userId'] === user.uid) {
    //           console.log("34");
    //           reviewed = true;
    //           return;
    //         }
    //       });
    //     })
    //     .catch(function(error) {
    //       console.log('Error getting documents: ', error);
    //     });
    // console.log(reviewed);
    reviewsRef.add(review);
    usersCollection.doc(user.uid).update({
      reviews: firebase.firestore.FieldValue.arrayUnion(review),
    });
    setReviewed(true);
  };

  /**
   * Populates array reviews with reviews from database in the beginning
   */
  useEffect(() => {
    if (initialize === false) {
      const tempReviews = [];
      reviewsRef.orderBy('timestamp', 'desc')
          .get()
          .then(function(querySnapshot) {
            setInitialize(true);
            querySnapshot.forEach((doc) => {
              tempReviews.push({
                name: doc.data().name,
                rating: doc.data().rating,
                text: doc.data().text,
                timestamp: doc.data().timestamp,
                userId: doc.data().userId,
              });
              if (doc.data()['userId'] === user.uid) {
                setReviewed(true);
              }
            });
            setReviews(tempReviews);
          })
          .catch(function(error) {
            console.log('error: ', error);
          });
    }
  }, [reviewsRef, initialize, user.uid]);

  return (
    <div className='reviews'>
      <Box container="true" justify="center" alignItems="center">
        <Typography variant="h4">
          Reviews
        </Typography>
        <AuthCheck
          fallback={
            <div>
              <br />
              <Typography variant='body1'>
                Sign in to leave a review.
              </Typography>
            </div>
          }
        >
          <NewReview
            gameId={gameId}
            user={user}
            handleAddReview={handleAddReview}
            reviewed={reviewed}
          />
        </AuthCheck>
        <Reviews reviews={reviews} />
      </Box>
    </div>
  );
}

AllReviews.propTypes = {
  gameId: PropTypes.string,
};

export default AllReviews;
