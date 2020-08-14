import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  videoDiv: {
    background: 'white',
    margin: '15px',
  },
  video: {
    transform: 'rotateY(180deg)',
    '-webkit-transform': 'rotateY(180deg)',
    '-moz-transform': 'rotateY(180deg)',
    width: '100%',
  },
}));

/**
 * @param {string} user The current user's display name
 * @return {ReactElement} Box with the users video and name
 */
export default function UserVideo({user, video, muted}) {
  const classes = useStyles();
  const setVideoRef = videoElement => {
    if(videoElement){
      videoElement.srcObject = video;
    }
  };

  return (
    <div className={classes.videoDiv}>
      {
        video ?
        <video className={classes.video} autoPlay={true} ref={setVideoRef} muted={muted} /> :
        null
      }
      {user}
    </div>
  );
}

UserVideo.propTypes = {
  user: PropTypes.string,
};
