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
  videoMirror: {
    'transform': 'rotateY(180deg)',
    '-webkit-transform': 'rotateY(180deg)',
    '-moz-transform': 'rotateY(180deg)',
    'width': '100%',
  },
  video: {
    width: '100%',
  },
}));

/**
 * @param {string} user The current user's display name
 * @return {ReactElement} Box with the users video and name
 */
export default function UserVideo({user, video, videoInfo}) {
  const classes = useStyles();
  const setVideoRef = (videoElement) => {
    if (videoElement) {
      videoElement.srcObject = video;
    }
  };

  return (
    <div className={classes.videoDiv}>
      {
        video ?
        <video
          className={videoInfo.local ? classes.videoMirror : classes.video}
          autoPlay={true}
          ref={setVideoRef}
          muted={videoInfo.local}
        /> :
        null
      }
      <div>
        <IconButton
          color="primary"
          size="small"
          disabled={!videoInfo.local}
          onClick={videoInfo.local ? videoInfo.toggleAudio : null}
        >
          {videoInfo.hasAudio ?
              <MicIcon fontSize="inherit" /> :
              <MicOffIcon fontSize="inherit" />
          }
        </IconButton>
        {user}
        <IconButton
          color="primary"
          size="small"
          disabled={!videoInfo.local}
          onClick={videoInfo.local ? videoInfo.toggleVideo : null}
        >
          {videoInfo.hasVideo ?
              <VideoCamIcon fontSize="inherit" /> :
              <VideoCamOffIcon fontSize="inherit" />
          }
        </IconButton>
      </div>
    </div>
  );
}

UserVideo.propTypes = {
  user: PropTypes.string,
  video: PropTypes.object,
  videoInfo: PropTypes.shape({
    local: PropTypes.bool,
    toggleAudio: PropTypes.func,
    hasAudio: PropTypes.bool,
    toggleVideo: PropTypes.func,
    hasVideo: PropTypes.bool,
  }),
};
