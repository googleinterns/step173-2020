import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Player from './Player';
import PersonalInfo from './PersonalInfo';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Chat from '../common/Chat';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  main: {
    height: '100vh',
  },
  video: {
    background: theme.palette.primary.main,
    textAlign: '-webkit-center',
  },
  gameContainer: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  card: {
    width: '100%',
  },
  mafiaChatDrawer: {
    position: 'absolute',
    top: '50%',
    left: 0,
  },
  mafiaChat: {
    width: '200px'
  },
}));

/**
 * @return {ReactElement} Mafia night element
 */
function MafiaNight({userUid, usersData, room,
  mafiaKill, doctorSave, detectiveCheck, mafiaChat}) {
  const classes = useStyles();
  const [initialize, setInitialize] = useState(false);
  const [players, setPlayers] = useState([]);
  const [userInfo, setUserInfo] = useState('');
  const [roleText, setRoleText] = useState('');
  const [message, setMessage] = useState('');
  const [mafiaChatOpen, setMafiaChatOpen] = useState(false);

  /**
   * @return {undefined}
   */
  function loadNightData() {
    if (initialize === false) {
      setInitialize(true);
      const roles = new Set();
      const allPlayers = [];
      usersData.forEach(function(u) {
        if (u.alive === true) {
          roles.add(u.role);
          allPlayers.push(u);
        }
        if (u.uid === userUid) {
          setUserInfo(u);
          switch (u.role) {
            case 1:
              setRoleText('Pretend to be clicking, tapping or thinking :)');
              break;
            case 2:
              setRoleText('Mafia, pick someone to kill.');
              break;
            case 3:
              setRoleText('Detective, who do you want to check tonight?');
              break;
            case 4:
              setRoleText('Doctor, who do you want to save tonight?');
              break;
            default:
              setMessage('Role is invalid.');
          }
        }
      });
      if (!roles.has(2)) {
        room.update({mafiaKill: {uid: '#', displayName: ''}});
      }
      if (!roles.has(3)) {
        room.update({detectiveCheck: {uid: '#', displayName: ''}});
      }
      if (!roles.has(4)) {
        room.update({doctorSave: {uid: '#', displayName: ''}});
      }
      setPlayers(allPlayers);
    }
    if (mafiaKill &&
      doctorSave &&
      detectiveCheck &&
      mafiaKill.uid !== '' &&
      doctorSave.uid !== '' &&
      detectiveCheck.uid !== '') {
      room.update({day: true});
    }
  }
  /**
   * Load the all the mafia related data
   */
  useEffect(loadNightData, [mafiaKill, doctorSave, detectiveCheck]);


  /**
   * @param {object} player information of player
   * @return {undefined}
   */
  function handleClick(player) {
    switch (userInfo.role) {
      case 2:
        if (mafiaKill.uid === '') {
          room.update(
              {mafiaKill: {uid: player.uid, displayName: player.displayName}});
          setMessage('You have killed ' + player.displayName + ' tonight.');
        } else if (room.mafiaKill !== player.uid) {
          setMessage('You have already chosen ' +
          mafiaKill.displayName + ' to kill tonight.');
        }
        break;
      case 3:
        if (detectiveCheck.uid === '') {
          if (player.role === 2) {
            setMessage('This person is bad.');
          } else {
            setMessage('This person is good.');
          }
          room.update(
              {detectiveCheck:
              {uid: player.uid, displayName: player.displayName}});
        } else {
          setMessage('You can only check once each night.');
        }
        break;
      case 4:
        if (doctorSave.uid === '') {
          room.update(
              {doctorSave: {uid: player.uid, displayName: player.displayName}});
          setMessage('You have saved ' + player.displayName + ' tonight.');
        } else if (room.doctorSave !== player.uid) {
          setMessage('You have already chosen ' +
          doctorSave.displayName + ' to save tonight.');
        }
        break;
      default:
        setMessage('Role is invalid.');
    }
  }

  return (
    <Grid className={classes.gameContainer} item>
      <PersonalInfo
        name={userInfo.displayName}
        role={userInfo.role}
        alive={userInfo.alive}
      />
      <div className={classes.mafiaChatDrawer}>
        <button onClick={() => setMafiaChatOpen(!mafiaChatOpen)}>
          mafia chat
        </button>
        <Paper className={classes.mafiaChat}>
          <Chat
            mafia={true}
            messages={mafiaChat}
            open={mafiaChatOpen}
            room={room}
            direction="right"
          />
        </Paper>
      </div>
      <Box m={10}>
        <Box className={classes.text} my={15} justify="center" mx="auto">
          <h2>{roleText}</h2>
          <h2>{message}</h2>
        </Box>
        {userInfo.role === 1 ? null :
          <Grid container justify="center" alignItems="center" spacing={4}>
            {
              players.map((u) => {
                return (
                  <Player
                    key={u.uid}
                    player={u}
                    handleClick={handleClick}
                  />
                );
              })
            }
          </Grid>
        }
      </Box>
    </Grid>
  );
}

MafiaNight.propTypes = {
  userUid: PropTypes.string,
  usersData: PropTypes.array,
  room: PropTypes.object,
  mafiaKill: PropTypes.object,
  doctorSave: PropTypes.object,
  detectiveCheck: PropTypes.object,
  mafiaChat: PropTypes.array,
};

const mapStateToProps = (state) => ({
  userUid: state.currentUser.uid,
  usersData: state.usersData,
  mafiaKill: state.roomData.mafiaKill,
  doctorSave: state.roomData.doctorSave,
  detectiveCheck: state.roomData.detectiveCheck,
  mafiaChat: state.roomData.mafiaChat
});

export default connect(
    mapStateToProps,
    {},
)(MafiaNight);
