import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PropTypes from 'prop-types';
import {useFirestoreDocData} from 'reactfire';
import * as firebase from 'firebase/app';

/**
 * Renders all users that satisfy search condition
 * @param {object} user User that sent a friend request
 * @param {object} userCollection Reference to users collection
 * @param {object} currUser Current user object
 * @return {ReactElement} Friend request
 */
export default function Request({user, userCollection, currUser}) {
  const currUserRef = userCollection.doc(currUser.uid);
  const currUserData = useFirestoreDocData(currUserRef);
  const userRef = userCollection.doc(user);
  const userData = useFirestoreDocData(userRef);

  /**
   * Add as friend to one another and delete request
   */
  function acceptRequest() {
    // add to current user's friends
    currUserRef.update({
      friends: firebase.firestore.FieldValue.arrayUnion(user),
    });
    // add to requester's friends
    userRef.update({
      friends: firebase.firestore.FieldValue.arrayUnion(currUser.uid),
    });
    declineRequest();
  }

  /**
   * Delete request from request field of current user
   */
  function declineRequest() {
    // delete from requests field
    for (let i = 0; i < currUserData.requests.length; i++) {
      if (currUserData.requests[i] === user) {
        currUserData.requests.splice(i, 1);
        if (currUserData.requests.length === 0) {
          userCollection.doc(currUser.uid).update({
            requests: [],
          });
        } else {
          userCollection.doc(currUser.uid).update({
            requests: currUserData,
          });
        }
      }
    }
  }

  return (
    // iterate through all users
    <div>
      <Grid container spacing={3}>
        <Grid item>
          <AccountCircleIcon />
          <Link href={'/profile/' + userRef.id}>
            &nbsp;{userData.displayName}
          </Link>
        </Grid>
        <Grid item>
          <Button
            variant='contained'
            color='primary'
            onClick={() => acceptRequest()}
          >
            Accept
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant='contained'
            color='primary'
            onClick={() => declineRequest()}
          >
            Decline
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

Request.propTypes = {
  user: PropTypes.object,
  userCollection: PropTypes.object,
  currUser: PropTypes.object,
};
