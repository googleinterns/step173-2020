import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import SettingsModal from '../mafia/SettingsModal';
import EndModal from '../mafia/EndModal';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

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
function WaitingRoom({gameName, gameDescription, leaveRoom, win,
  joinRoom, inRoom, isHost, usersCollection, startGame, gameId}) {
  const classes = useStyles();
  const [settingsOpen, setSettingsOpen] = useState(false);
  /**
   * @return {object} inner HTML
   */
  function createMarkup() {
    return {__html: gameDescription};
  }
  const [endOpen, setEndOpen] = useState(true);

  return (
    <div className={classes.main}>
      <div className={classes.title}>
        <Typography variant="h3" className={classes.fonts}>
          {gameName}
        </Typography>
      </div>
      <div className={classes.game}>
        <div
          dangerouslySetInnerHTML={createMarkup()}
        >
        </div>
      </div>
      <div>
        {
          win && win !== 0 ?
          (
            <Modal
              open={endOpen}
              onClose={() => setEndOpen(false)}
              className={classes.modal}
            >
              <div className={classes.paper}>
                <EndModal
                  winMessage={win === 1 ? 'Town wins!' : 'Mafia wins!'}
                />
              </div>
            </Modal>
          ) :
          null
        }
      </div>
      <div className={classes.actionBtns}>
        {
          inRoom ?
            (
              <div className={classes.inRoomBtns}>
                { isHost ?
                  (
                    <div>
                      <Button
                        className={classes.btn}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          gameId === '925' && setSettingsOpen(true);
                        }}
                      >
                        Start Game
                      </Button>
                      <Modal
                        open={settingsOpen}
                        onClose={() => setSettingsOpen(false)}
                        className={classes.modal}
                      >
                        <div className={classes.paper}>
                          <SettingsModal
                            usersCollection={usersCollection}
                            startGame={startGame}
                          />
                        </div>
                      </Modal>
                    </div>
                  ) :
                  (
                    'Waiting for the host'
                  )
                }
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
  usersCollection: PropTypes.object,
  startGame: PropTypes.func,
  gameId: PropTypes.string,
  win: PropTypes.number,
};

const mapStateToProps = (state) => ({
  gameId: state.roomData.gameId,
  win: state.roomData.win,
});

export default connect(
    mapStateToProps,
    {},
)(WaitingRoom);
