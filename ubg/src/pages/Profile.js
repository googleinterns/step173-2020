import React, {useState, useEffect} from 'react';
import {useUser, useFirestoreDocData, useFirestore} from 'reactfire';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Navbar from '../common/Navbar';
import {makeStyles} from '@material-ui/core/styles';
import FavoriteGames from '../profile/FavoriteGames';
import Reviews from '../reviews/Reviews';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {useParams} from 'react-router-dom';
import AddFriendButton from '../profile/AddFriendButton';

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
  friendContainer: {
    position: 'relative',
  },
}));

/**
 * @return {ReactElement} Displays profile page
 */
export default function Profile() {
  const [user, setUser] = useState(useUser());
  const classes = useStyles();
  const userCollection = useFirestore().collection('users');
  const {uid} = useParams();

  /**
   * Get user with entered Id
   * @return {void}
   */
  function getUser() {
    if (uid) {
      const docRef = userCollection.doc(uid);
      docRef.get().then(function(doc) {
        if (doc.exists) {
          const newUser = doc.data();
          newUser.uid = uid;
          setUser(newUser);
        }
      }).catch(function(error) {
        setUser(null);
        console.log('Error getting document:', error);
      });
    }
  }
  useEffect(getUser, [uid]);

  return (
    <div>
      <Navbar />
      <Box justify='center' alignItems='center'
        mt={10} ml={10} mr={10}>
        <Box m={10}>
          <Grid container justify="flex-start" alignItems="stretch" spacing={4}>
            <Grid item>
              <Typography variant='h2' className={classes.fonts}>
                {user ? user.displayName : 'Sign in to view your profile'}
              </Typography>
            </Grid>
            {
              uid === undefined ?
              null :
              <Grid item className={classes.friendContainer}
                xs={12} sm={6} xl={2} lg={3} md={4}>
                <AddFriendButton userCollection={userCollection}/>
              </Grid>
            }
          </Grid>
          <Typography variant='h6' className={classes.fonts}>
            {user ? 'user id: ' + user.uid : null}
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

/**
 * @param {object} userCollection Reference to user collection
 * @param {string} uid User ID of current user
 * @return {ReactElement} Returns game statistics for user
 */
function UserStats({userCollection, uid}) {
  const classes = useStyles();
  const userStats = useFirestoreDocData(userCollection.doc(uid)).mafiaStats;
  return (
    <Box m={10}>
      <Typography variant='h4' className={classes.fonts}>
        Game Statistics
      </Typography>
      <br />
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.fonts} variant="h5">
            Mafia (Werewolf)
          </Typography>
          <br />
          <Typography variant="body1">
            Wins: {userStats.wins}
          </Typography>
          <Typography variant="body1">
            Losses: {userStats.losses}
          </Typography>
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
  }

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

UserStats.propTypes = {
  userCollection: PropTypes.object,
  uid: PropTypes.string,
};

UserReviews.propTypes = {
  userCollection: PropTypes.object,
  uid: PropTypes.string,
};
