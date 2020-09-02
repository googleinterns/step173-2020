import React, {useState, useEffect} from 'react';
import Box from '@material-ui/core/Box';
import Reviews from './Reviews';
import Typography from '@material-ui/core/Typography';
import {
  useFirestore,
  AuthCheck,
  useUser,
  useFirestoreDocData,
} from 'reactfire';
import NewReview from './NewReview';
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
  const userFriends = useFirestoreDocData(
    usersCollection.doc((user && user.uid) || ' ')).friends;
  const handleAddReview = (review) => {
    const newActivity = {
      type: 'review',
      uid: review.userId,
      timestamp: review.timestamp,
      displayName: review.name,
      game: review.gameName,
    };
    usersCollection.doc(user.uid).update({
      reviews: firebase.firestore.FieldValue.arrayUnion(review),
      activities: firebase.firestore.FieldValue.arrayUnion(newActivity),
    });
    reviewsRef.add(review).then(function(docRef) {
      const copy = {...review};
      review.reviewData = copy;
      review.reviewId = docRef.id;
      const tempReviews = [...reviews];
      tempReviews.unshift(review);
      setReviews(tempReviews);
      setReviewed(true);
    });
    userFriends.forEach(
      (friend) => {
        usersCollection.doc(friend.uid).update({
          activities: firebase.firestore.FieldValue.arrayUnion(newActivity),
        });
      }
    );
  };

  /**
   * Load reviews data of this game
   */
  function loadReviews() {
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
                reviewId: doc.id,
                reviewData: doc.data(),
              });
              if (user && doc.data()['userId'] === user.uid) {
                setReviewed(true);
              }
            });
            setReviews(tempReviews);
          })
          .catch(function(error) {
            console.log('error: ', error);
          });
    }
  }

  /**
   * Load reviews data
   */
  useEffect(loadReviews, [reviewsRef, initialize]);

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
        <Reviews
          reviews={reviews}
          profile={false}
          reviewsRef={reviewsRef}
          usersDoc={usersCollection}
          setInitialize={setInitialize}
          setReviewed={setReviewed}
          userFriends={userFriends}
        />
      </Box>
    </div>
  );
}

AllReviews.propTypes = {
  gameId: PropTypes.string,
};

export default AllReviews;
