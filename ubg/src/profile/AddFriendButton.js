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
  const classes = useStyles();
  const friendUid = useParams().uid;
  const userFriends = useFirestoreDocData(
      userCollection.doc(user.uid)).friends;
  const otherFriends = useFirestoreDocData(
      userCollection.doc(friendUid)).friends;
  const friendRequests = useFirestoreDocData(
      userCollection.doc(friendUid)).requests;
  const [friend, setFriend] = useState(findUser(friendUid, userFriends));
  const [invite, setInvite] = useState(findUser(user.uid, friendRequests));

  return (
    {user} ?
    (
      <Button
        variant='contained'
        color='primary'
        onClick={() => addFriend(userFriends, otherFriends, user, friendUid,
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
  for (let i = 0; i < list.length; i++) {
    if (list[i].uid === uid) {
      return true;
    }
  }
  return false;
}

/**
 * Deletes friendUid from uid's friends list
 * @param {string} uid Current user's uid
 * @param {string} friendUid Friend's uid
 * @param {array} friends Array of current user's friends
 * @param {object} userCollection Reference to users collection
 */
function unfriend(uid, friendUid, friends, userCollection) {
  for (let i = 0; i < friends.length; i++) {
    if (friends[i].uid === friendUid) {
      friends.splice(i, 1);
      if (friends.length === 0) {
        userCollection.doc(uid).update({
          friends: [],
        });
      } else {
        userCollection.doc(uid).update({
          friends: friends,
        });
      }
    }
  }
}

/**
 * Deletes from friends or sends a friend request
 * @param {array} userFriends Array of current user's friends
 * @param {array} otherFriends Array of other user's friends
 * @param {string} user Current user object
 * @param {string} friendUid User id of friend
 * @param {object} userCollection Reference to users collection
 * @param {bool} friend If this user is a friend
 * @param {func} setFriend Sets if user is a friend
 * @param {func} setInvite Sets if friend request has been sent
 * @param {array} friendRequests Array of friend's friend requests
 */
function addFriend(userFriends, otherFriends, user, friendUid,
    userCollection, friend, setFriend, setInvite, friendRequests) {
  if (friend) {
    // delete from friends for both users
    unfriend(user.uid, friendUid, userFriends, userCollection);
    unfriend(friendUid, user.uid, otherFriends, userCollection);
    setFriend(false);
    setInvite(false);
    return;
  } else {
    // send a request
    friendRequests.push({
      uid: user.uid,
      displayName: user.displayName,
    });
    userCollection.doc(friendUid).update({
      requests: Array.from(new Set(friendRequests)),
    });
    setInvite(true);
  }
}

AddFriendButton.propTypes = {
  userCollection: PropTypes.object,
};
