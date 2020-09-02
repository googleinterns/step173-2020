import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Request from './Request';
import {useUser, useFirestoreDocData, useFirestore} from 'reactfire';

/**
 * Renders all users that sent a friend request
 * @return {ReactElement} List with ListItems of users
 */
export default function FriendRequests() {
  const userCollection = useFirestore().collection('users');
  const currUser = useUser();
  const users = useFirestoreDocData(
      userCollection.doc(currUser.uid)).requests;
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
