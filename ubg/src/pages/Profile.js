import React, {useState, useEffect} from 'react';
import {
  useFirestore,
  AuthCheck,
  useUser,
  useFirestoreDocData,
} from 'reactfire';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Navbar from '../common/Navbar';
import {makeStyles} from '@material-ui/core/styles';
import FavoriteGames from '../profile/FavoriteGames';
import Reviews from '../reviews/Reviews';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CardContent from '@material-ui/core/CardContent';
import AddFriendButton from '../profile/AddFriendButton';
import Friend from '../profile/Friend';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
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
  friendContainer: {
    position: 'relative',
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
  const user = useUser();
  const [currUser, setCurrUser] = useState(useUser());
  const classes = useStyles();
  const {uid} = useParams();
  const userCollection = useFirestore().collection('users');

  /**
   * Get user with entered Id
   * @return {void}
   */
  function getUser() {
    if (user) {
      const docRef = userCollection.doc(uid);
      docRef.get().then(function(doc) {
        if (doc.exists) {
          const newUser = doc.data();
          newUser.uid = uid;
          setCurrUser(newUser);
        }
      }).catch(function(error) {
        setCurrUser(null);
        console.log('Error getting document:', error);
      });
    }
  }
  useEffect(getUser, [user, uid]);

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
          <Grid container justify="flex-start" alignItems="stretch" spacing={4}>
            <Grid item>
              <Typography variant='h2' className={classes.fonts}>
                {user && currUser ? currUser.displayName :
                  'Sign in to view profiles'}
              </Typography>
            </Grid>
            {
              uid === (user ? user.uid : uid) ?
              null :
              <Grid item className={classes.friendContainer}
                xs={12} sm={6} xl={2} lg={3} md={4}>
                <AddFriendButton userCollection={userCollection}/>
              </Grid>
            }
          </Grid>
          <Typography variant='h6' className={classes.fonts}>
            {user ? 'user id: ' + uid : null}
          </Typography>
          <hr />
        </Box>
        <AuthCheck>
          <div>
            <UserStats userCollection={userCollection} uid={uid} />
            <FavoriteGames userCollection={userCollection} uid={uid} />
            <UserFriends userCollection={userCollection}
              uid={uid} />
            <UserReviews userCollection={userCollection} uid={uid} />
          </div>
        </AuthCheck>
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
 * @param {object} Reference to user collection
 * @param {string} uid Current user's uid
 * @return {ReactElement} List of current user's friends
 */
function UserFriends({userCollection, uid}) {
  const classes = useStyles();
  const userFriends = useFirestoreDocData(
      userCollection.doc(uid)).friends;

  /**
   * Alphabetically order friend names
   * @param {object} a Friend object
   * @param {object} b Friend object
   * @return {number} Ordering of name
   */
  function compare(a, b) {
    const nameA = a.displayName.toUpperCase();
    const nameB = b.displayName.toUpperCase();
    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
  }

  return (
    <Box mt={10} ml={10} mr={10}>
      <hr /> <br /> <br />
      <Typography variant='h4' className={classes.fonts}>
        Friends
      </Typography>
      {userFriends.length === 0 ?
        <div>
          <br />
          <Typography variant='body1'>
            No friends to show
          </Typography>
        </div> :
        <List width="100%">
          {
            userFriends.sort(compare).map((friend) => {
              return (
                <ListItem key={friend.uid}>
                  <Friend friend={friend} userCollection={userCollection} />
                </ListItem>
              );
            })
          }
        </List>
      }
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
      <Box ml={10} mr={10} mt={5}>
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

UserFriends.propTypes = {
  userCollection: PropTypes.object,
  uid: PropTypes.string,
};

UserReviews.propTypes = {
  userCollection: PropTypes.object,
  uid: PropTypes.string,
};
