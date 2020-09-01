import React from 'react';
import Link from '@material-ui/core/Link';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PropTypes from 'prop-types';

/**
 * @param {string} friend Current user's friend's uid
 * @param {object} userCollection Reference to user collection
 * @return {ReactElement} Friend's link to profile page
 */
export default function Friend({friend}) {
  return (
    <div>
      <AccountCircleIcon />
      <Link href={'/profile/' + friend.uid}>
        &nbsp;{friend.displayName}
      </Link>
    </div>
  );
}

Friend.propTypes = {
  friend: PropTypes.object,
};
