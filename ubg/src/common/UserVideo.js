import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  videoDiv: {
    background: 'white',
    margin: '15px',
  },
}));

/**
 * @param {string} user The current user's display name
 * @returns {ReactElement} Box with the users video and name
 */
export default function UserVideo({user}) {
  const classes = useStyles();
  return (
    <div className={classes.videoDiv}>
      {user}
    </div>
  );
}

UserVideo.propTypes = {
    user: PropTypes.string,
};
