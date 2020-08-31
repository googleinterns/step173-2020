import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PropTypes from 'prop-types';

/**
 * Renders all users that satisfy search condition
 * @param {object} users
 * @return {ReactElement} List with ListItems of users
 */
export default function UserResults({users}) {
  return (
    // iterate through all users
    <div>
      <List width="100%">
        {users.map((user) =>
          <ListItem key={user.id}>
            <AccountCircleIcon />
            <Link href={'/profile/' + user.id}>
              {user.displayName}
            </Link>
            <Divider />
          </ListItem>,
        )}
      </List>
    </div>
  );
}

UserResults.propTypes = {
  users: PropTypes.array,
};
