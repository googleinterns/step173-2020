import React from 'react';
import {useUser, useFirestoreDocData, useFirestore} from 'reactfire';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Navbar from '../common/Navbar';
import {makeStyles} from '@material-ui/core/styles';
import FavoriteGames from '../profile/FavoriteGames';
import Reviews from '../reviews/Reviews';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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
      <Box container='true' justify='center' alignItems='center' mt={10} ml={30} mr={30}>
        <Box m={10}>
          <Typography variant='h2' className={classes.fonts}>
            {user ? user.displayName : 'Sign in to view your profile'}
          </Typography>
          <hr />
        </Box>
        {user ? (
          <div>
            <UserStats userCollection={userCollection} uid={user.uid} />
            <FavoriteGames userCollection={userCollection} uid={user.uid} />
            <UserReviews userCollection={userCollection} uid={user.uid} />
          </div>
        ) : ''}
      </Box>
    </div>
  );
}

function UserStats({userCollection, uid}) {
  const classes = useStyles();
  const userStats = useFirestoreDocData(userCollection.doc(uid)).mafiaStats;
  return (
    <Box m={10}>
      <Typography variant='h4' className={classes.fonts}>
        Game Statistics
      </Typography>
      <br />
      <Card container className={classes.card}>
        <CardContent>
          <Typography className={classes.fonts} variant="h5">
            Mafia (Werewolf)
          </Typography>
          <br />
          Wins: {userStats.wins}
          <br />
          Losses: {userStats.losses}
        </CardContent>
      </Card>
      <br /> <hr />
    </Box>
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
  }git status

  return (
    <div>
      <Box m={10}>
        <hr /> <br /> <br />
        <Typography variant='h4' className={classes.fonts}>
          Reviews
        </Typography>
        {
          userReviews.length !== 0 ?
          <Reviews reviews={userReviews.sort(compare)} profile={true}/> :
          <div>
            <br />
            <Typography variant='body1'>
              No reviews to show
            </Typography>
          </div>
        }
      </Box>
    </div>
  );
}

UserReviews.propTypes = {
  userCollection: PropTypes.object,
  uid: PropTypes.string,
};
