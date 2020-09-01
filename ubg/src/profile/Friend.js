import React from 'react';
import Link from '@material-ui/core/Link';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {useFirestoreDocData} from 'reactfire';
import PropTypes from 'prop-types';

/**
 * @param {string} friend Current user's friend's uid
 * @param {object} userCollection Reference to user collection
 * @return {ReactElement} Friend's link to profile page
 */
export default function Friend({friend, userCollection}) {
  const friendRef = userCollection.doc(friend);
  const friendData = useFirestoreDocData(friendRef);

  return (
    <div>
      <AccountCircleIcon />
      <Link href={'/profile/' + friendRef.id}>
        &nbsp;{friendData.displayName}
      </Link>
    </div>
  );
}

Friend.propTypes = {
  friend: PropTypes.string,
  userCollection: PropTypes.object,
};
