import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import SettingsModal from './SettingsModal';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  main: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    textAlign: 'center',
    margin: '20px',
  },
  game: {
    margin: '10px 35px',
    flexGrow: 1,
    overflow: 'scroll',
    // Hacky fix for scroll with flexGrow
    height: '200px',
  },
  actionBtns: {
    width: '100%',
    alignItems: 'center',
    margin: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  fonts: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  btn: {
    margin: '5px',
  },
  inRoomBtns: {
    display: 'flex',
    flexDirection: 'column',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

/**
 * @return {ReactElement} Waiting room element
 */
export default function WaitingRoom({usersData, gameName, gameDescription,
  leaveRoom, joinRoom, inRoom, isHost, usersCollection, startGame, roomData}) {
  const classes = useStyles();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className={classes.main}>
      <div className={classes.title}>
        <Typography variant="h3" className={classes.fonts}>
          {gameName}
        </Typography>
      </div>
      <div className={classes.game}>
        <Typography variant="body1">
          {gameDescription}
        </Typography>
      </div>
      <div className={classes.actionBtns}>
        {
          inRoom ?
            (
              <div className={classes.inRoomBtns}>
                { isHost ?
                  <div>
                    <Button
                      className={classes.btn}
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        roomData.gameId === '925' && setSettingsOpen(true)
                      }}
                    >
                      Start Game
                    </Button>
                    <Modal
                      open={settingsOpen}
                      onClose={() => setSettingsOpen(false)}
                      aria-labelledby="simple-modal-title"
                      aria-describedby="simple-modal-description"
                      className={classes.modal}
                    >
                      <div className={classes.paper}>
                        <SettingsModal
                          usersData={usersData}
                          usersCollection={usersCollection}
                          startGame={startGame}
                        />
                      </div>
                    </Modal>
                  </div> :
                  'Waiting for the host'}
                <Button
                  className={classes.btn}
                  variant="contained"
                  onClick={leaveRoom}
                >Leave Room</Button>
              </div>
            ) :
            <Button
              className={classes.btn}
              variant="contained"
              color="primary"
              onClick={joinRoom}
            >Join Room</Button>
        }
      </div>
    </div>
  );
}

WaitingRoom.propTypes = {
  gameName: PropTypes.string,
  gameDescription: PropTypes.string,
  leaveRoom: PropTypes.func,
  joinRoom: PropTypes.func,
  inRoom: PropTypes.bool,
  isHost: PropTypes.bool,
  usersData: PropTypes.object,
  usersCollection: PropTypes.object,
  startGame: PropTypes.func,
  roomData: PropTypes.object,
};
