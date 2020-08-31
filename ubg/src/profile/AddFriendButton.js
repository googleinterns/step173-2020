import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import {useUser, useFirestoreDocData} from 'reactfire';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  friendButton: {
    position: 'absolute',
    top: '35%',
  },
}));

/**
 * @param {object} Reference to users collection
 * @return {ReactElement} Button to friend/unfriend user
 */
export default function AddFriendButton({userCollection}) {
  const user = useUser();
  const userUid = (user && user.uid) || ' ';
  const classes = useStyles();
  const friendUid = useParams().uid;
  const userFriends = useFirestoreDocData(
      userCollection.doc(userUid)).friends;
  const friendRequests = useFirestoreDocData(
      userCollection.doc(friendUid || ' ')).requests;
  const [friend, setFriend] = useState(findUser(friendUid, userFriends));
  const [invite, setInvite] = useState(findUser(userUid, friendRequests));

  return (
    {user} ?
    (
      <Button
        variant='contained'
        color='primary'
        onClick={() => addFriend(userFriends, userUid, friendUid,
            userCollection, friend, setFriend, setInvite, friendRequests)}
        className={classes.friendButton}
        disabled={invite}>
        {friend ?
            'Unfriend' :
            (
              invite ?
              'Request Sent' :
              'Add Friend'
            )
        }
      </Button>
    ) :
    null
  );
}

/**
 * Finds if user is contained in list
 * @param {string} uid User id to find
 * @param {array} list Array of user ids
 * @return {bool} If user contained in list
 */
function findUser(uid, list) {
  list.forEach((otherUid) => {
    if (otherUid === uid) {
      return true;
    }
  });
  return false;
}

/**
 * Deletes from friends or sends a friend request
 * @param {array} userFriends Array of current user's friends
 * @param {string} userUid User id of current user
 * @param {string} friendUid User id of friend
 * @param {object} userCollection Reference to users collection
 * @param {bool} friend If this user is a friend
 * @param {func} setFriend Sets if user is a friend
 * @param {func} setInvite Sets if friend request has been sent
 * @param {array} friendRequests Array of friend's friend requests
 */
function addFriend(userFriends, userUid, friendUid, userCollection,
    friend, setFriend, setInvite, friendRequests) {
  if (friend) {
    // delete from friends
    for (let i = 0; i < userFriends.length; i++) {
      if (userFriends[i].id === friendUid) {
        userFriends.splice(i, 1);
        if (userFriends.length === 0) {
          userCollection.doc(userUid).update({
            friends: [],
          });
        } else {
          userCollection.doc(userUid).update({
            friends: userFriends,
          });
        }
        setFriend(false);
        setInvite(false);
        return;
      }
    }
  } else {
    // send a request
    friendRequests.push(userUid);
    userCollection.doc(friendUid).update({
      requests: Array.from(new Set(friendRequests)),
    });
    setInvite(true);
  }
}

AddFriendButton.propTypes = {
  userCollection: PropTypes.object,
};
