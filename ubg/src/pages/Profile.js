import React, {useState, useEffect} from 'react';
import {useUser, useFirestoreDocData, useFirestore} from 'reactfire';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Navbar from '../common/Navbar';
import {makeStyles} from '@material-ui/core/styles';
import FavoriteGames from '../profile/FavoriteGames';
import Reviews from '../reviews/Reviews';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CardContent from '@material-ui/core/CardContent';
import {useParams, useHistory} from 'react-router-dom';

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
  arrowBack: {
    float: 'left',
    marginLeft: '0.4em',
    marginTop: '0.4em',
  },
}));

/**
 * @return {ReactElement} Displays profile page
 */
export default function Profile() {
  const history = useHistory();
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
      <IconButton
        color="primary"
        component="span"
        onClick={() => history.goBack()}
        className={classes.arrowBack}
      >
        <ArrowBack fontSize="large" />
      </IconButton>
      <Box justify='center' alignItems='center'
        m={10}>
        <Box m={10}>
          <Typography variant='h2' className={classes.fonts}>
            {user ? user.displayName : 'Sign in to view your profile'}
          </Typography>
          <Typography variant='h6' className={classes.fonts}>
            {user ? 'unique id: ' + user.uid : null}
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
