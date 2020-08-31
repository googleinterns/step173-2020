import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import Request from './Request';
import {useFirestore} from 'reactfire';

/**
 * Renders all users that sent a friend request
 * @param {object} users All users who sent a friend request
 * @param {object} currUser Current user object
 * @return {ReactElement} List with ListItems of users
 */
export default function FriendRequests({users, currUser}) {
  const userCollection = useFirestore().collection('users');

  return (
    // iterate through all users
    <div>
      <List width="100%">
        {users.map((user) =>
          <ListItem key={user}>
            <Request user={user} userCollection={userCollection}
              currUser={currUser}/>
          </ListItem>,
        )}
      </List>
    </div>
  );
}

FriendRequests.propTypes = {
  users: PropTypes.array,
  currUser: PropTypes.object,
};
