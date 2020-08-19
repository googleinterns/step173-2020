import React from 'react';
import {useUser, useFirestoreDocData, useFirestore} from 'reactfire';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Navbar from '../common/Navbar';
import {makeStyles} from '@material-ui/core/styles';
import FavoriteGames from '../profile/FavoriteGames';
import Reviews from '../reviews/Reviews';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  fonts: {
    fontWeight: 'bold',
  },
  pagination: {
    '& > *': {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
  },
}));

/**
 * @return {ReactElement} Displays profile page
 */
export default function Profile() {
  const user = useUser();
  const classes = useStyles();
  const userCollection = useFirestore().collection('users');

  return (
    <div>
      <Navbar />
      <Box container='true' justify='center' alignItems='center' m={10}>
        <Box m={10}>
          <Typography variant='h2' className={classes.fonts}>
            {user ? user.displayName : 'Sign in to view your profile'}
          </Typography>
          <hr />
        </Box>
        {user ? (
          <div>
            <FavoriteGames userCollection={userCollection} uid={user.uid} />
            <UserReviews userCollection={userCollection} uid={user.uid} />
          </div>
        ) : ''}
      </Box>
    </div>
  );
}

/**
 * @param {object} userCollection Reference to user collection
 * @param {string} uid User ID of current user
 * @return {ReactElement} Reviews user has left
 */
function UserReviews({userCollection, uid}) {
  const userReviews = useFirestoreDocData(userCollection.doc(uid)).reviews;
  const classes = useStyles();

  /**
   * Orders by timestamp of reviews
   * @param {number} a Timestamp from first review
   * @param {number} b Timestamp from second review
   * @return {number} Timestamp comparison
   */
  function compare(a, b) {
    return b.timestamp - a.timestamp;
  }

  return (
    <div>
      <Box m={10}>
        <hr /> <br /> <br />
        <Typography variant='h4' className={classes.fonts}>
          Reviews
        </Typography>
        <Reviews reviews={userReviews.sort(compare)} profile={true}/>
      </Box>
    </div>
  );
}

UserReviews.propTypes = {
  userCollection: PropTypes.object,
  uid: PropTypes.string,
};
