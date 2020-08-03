import firebase from 'firebase/app';
import React, {useState, useEffect} from 'react';
import Box from '@material-ui/core/Box';
import Reviews from './Reviews';
import Typography from '@material-ui/core/Typography';
import {useFirestore} from 'reactfire';
import NewReview from './NewReview';
import {AuthCheck, useAuth, useUser} from 'reactfire';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

/**
 * Displays the review section of a game page and handles review input
 * @param {string} gameId ID of current game on page
 * @return {ReactElement} Box containing review section
 */
function AllReviews({gameId}) {
  const reviewsRef = useFirestore()
      .collection('gameReviews')
      .doc(gameId)
      .collection('reviews');
  const auth = useAuth();
  const user = useUser();
  const [reviews, setReviews] = useState([]);
  const [initialize, setInitialize] = useState(false);

  /**
  * Shows a popup for user to sign in
  */
  async function signIn() {
    await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  };

  const handleAddReview = (review) => {
    const tempReviews = [...reviews];
    tempReviews.unshift(review);
    setReviews(tempReviews);
    reviewsRef.add(review);
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
            });
            setReviews(tempReviews);
          })
          .catch(function(error) {
            console.log('error: ', error);
          });
    }
  }, [reviewsRef, initialize]);

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
              <Button variant="contained" color="primary" onClick={signIn}>
                Sign in to leave a review
              </Button>
            </div>
          }
        >
          <NewReview gameId={gameId} user={user}
            handleAddReview={handleAddReview} />
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
