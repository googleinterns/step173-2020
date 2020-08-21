import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import SettingsModal from '../mafia/SettingsModal';
import EndModal from '../mafia/EndModal';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import villager from '../mafia/images/villager.png';
import mafia from '../mafia/images/mafia.png';
import detective from '../mafia/images/detective.png';
import doctor from '../mafia/images/doctor.png';
import {useHistory} from 'react-router-dom';

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
  home: {
    float: 'left',
  },
}));

/**
 * @return {ReactElement} Waiting room element
 */
function WaitingRoom({gameName, gameDescription, leaveRoom, win,
  joinRoom, inRoom, isHost, usersCollection, startGame, gameId}) {
  const classes = useStyles();
  const history = useHistory();
  const villagerImage = '<img src="' + villager +
    '" style="width:100%" alt="Villager">';
  const mafiaImage = '<img src="' + mafia +
    '" style="width:100%" alt="Mafia">';
  const detectiveImage = '<img src="' + detective +
    '" style="width:100%" alt="Detective">';
  const doctorImage = '<img src="' + doctor +
    '" style="width:100%" alt="Doctor">';

  const [settingsOpen, setSettingsOpen] = useState(false);
  /**
   * @return {object} inner HTML
   */
  function createMarkup() {
    return {__html: gameDescription +
      '<div class="row">' +
        '<div class="column">' +
          villagerImage +
          '<h3>Villager</h3>' +
          '<p>A role with no night actions</p>' +
        '</div>' +
        '<div class="column">' +
          mafiaImage +
          '<h3>Mafia</h3>' +
          '<p>A role that can vote to kill one player each night</p>' +
        '</div>' +
        '<div class="column">' +
          detectiveImage +
          '<h3>Detective</h3>' +
          '<p>A role that can vote to kill one player each night</p>' +
        '</div>' +
        '<div class="column">' +
          doctorImage +
          '<h3>Doctor</h3>' +
          '<p>A role that can choose a person to save each night. ' +
          'If the mafia targets the same person, they will remain alive.</p>' +
        '</div>' +
      '</div>' +
      '<style>' +
        '.row { display: flex;}' +
        '.column { flex: 25%; padding: 5px; }' +
      '/style',
    };
  }
  const [endOpen, setEndOpen] = useState(true);

  return (
    <div className={classes.main}>
      <div className={classes.title}>
        <IconButton
          color="primary"
          component="span"
          onClick={() => history.push('/')}
          className={classes.home}
        >
          <HomeIcon fontSize="large" />
        </IconButton>
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
