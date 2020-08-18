import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import VideoCamIcon from '@material-ui/icons/Videocam';
import VideoCamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

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
export default function UserVideo({user, video, local}) {
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
        <video className={classes.video} autoPlay={true} ref={setVideoRef} muted={local} /> :
        null
      }
      <div>
        {local ?
          <IconButton
              color="primary"
              size="small"
              onClick={local.toggleAudio}
            >
              {local.localAudio ?
                <MicIcon fontSize="inherit" /> :
                <MicOffIcon fontSize="inherit" />
              }
          </IconButton> :
          null
        }
        {user}
        {local ?
          <IconButton
              color="primary"
              size="small"
              onClick={local.toggleVideo}
            >
              {local.localVideo ?
                <VideoCamIcon fontSize="inherit" /> :
                <VideoCamOffIcon fontSize="inherit" />
              }
          </IconButton> :
          null
        }
      </div>
    </div>
  );
}

UserVideo.propTypes = {
  user: PropTypes.string,
};
