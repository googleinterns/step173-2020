import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import VideoCamIcon from '@material-ui/icons/Videocam';
import VideoCamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import RetryIcon from '@material-ui/icons/Cached';

const classNames = require('classnames');

const useStyles = makeStyles((theme) => ({
  videoDiv: {
    background: 'white',
    margin: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  videoMirror: {
    'transform': 'rotateY(180deg)',
    '-webkit-transform': 'rotateY(180deg)',
    '-moz-transform': 'rotateY(180deg)',
  },
  video: {
    width: '35%',
  },
  userInfo: {
    flexGrow: 1,
  },
  hidden: {
    display: 'none',
  },
  connection: {
    width: '10px',
    height: '10px',
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderRadius: '50%',
  },
  connected: {
    background: 'green',
  },
  loading: {
    background: 'gray',
  },
  failed: {
    background: 'red',
  },
  retryBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    color: 'red',
  },
}));

/**
 * @param {string} user The current user's display name
 * @return {ReactElement} Box with the users video and name
 */
export default function UserVideo({user, video, videoInfo, connection}) {
  const classes = useStyles();
  const setVideoRef = (videoElement) => {
    if (videoElement) {
      videoElement.srcObject = video;
    }
  };

  const videoClasses = classNames({
    [classes.video]: true,
    [classes.videoMirror]: videoInfo.local,
    [classes.hidden]: videoInfo.hasVideo === false,
  });

  const connectionClasses = classNames({
    [classes.connection]: true,
    [classes.connected]: connection ? connection.status === 'connected' : false,
    [classes.loading]: connection ? connection.status === 'connecting' : false,
    [classes.failed]: connection ? connection.status === 'failed' : false,
  });

  return (
    <div className={classes.videoDiv}>
      {connection && connection.status === 'failed' ?
          <IconButton
            size="small"
            onClick={connection.reload}
            className={classes.retryBtn}
          >
            <RetryIcon />
          </IconButton> :
          <div
            className={connectionClasses}
          />
      }
      {
        video != null ?
        <video
          className={videoClasses}
          autoPlay={true}
          ref={setVideoRef}
          muted={videoInfo.local}
        /> :
        null
      }
      <div className={classes.userInfo}>
        <IconButton
          color="primary"
          size="small"
          disabled={!videoInfo.local || videoInfo.night}
          onClick={videoInfo.local ? videoInfo.toggleAudio : null}
        >
          {videoInfo.hasAudio ?
              <MicIcon fontSize="inherit" /> :
              videoInfo.hasAudio === false ?
              <MicOffIcon fontSize="inherit" /> :
              null
          }
        </IconButton>
        {user}
        <IconButton
          color="primary"
          size="small"
          disabled={!videoInfo.local || videoInfo.night}
          onClick={videoInfo.local ? videoInfo.toggleVideo : null}
        >
          {videoInfo.hasVideo ?
              <VideoCamIcon fontSize="inherit" /> :
              videoInfo.hasVideo === false ?
              <VideoCamOffIcon fontSize="inherit" /> :
              null
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
    night: PropTypes.bool,
  }),
  connection: PropTypes.shape({
    status: PropTypes.string,
    reload: PropTypes.func,
  }),
};
