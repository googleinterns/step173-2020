import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Player from './Player';
import PersonalInfo from './PersonalInfo';
import PropTypes from 'prop-types';

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
}));

/**
 * @return {ReactElement} Mafia night element
 */
export default function MafiaNight({user, usersData, room,
  mafiaKill, doctorSave, detectiveCheck}) {
  const classes = useStyles();
  const [initialize, setInitialize] = React.useState(false);
  const [players, setPlayers] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState('');
  const [roleText, setRoleText] = React.useState('');
  const [message, setMessage] = React.useState('');

  /**
   * @return {undefined}
   */
  function loadNightData() {
    if (mafiaKill['uid'] !== '' &&
    doctorSave['uid'] !== '' &&
    detectiveCheck['uid'] !== '') {
      room.update({day: true});
    }
    if (initialize === false) {
      setInitialize(true);
      const roles = new Set();
      const allPlayers = [];
      usersData.forEach(function(u) {
        if (u.alive === true) {
          roles.add(u.role);
          allPlayers.push(u);
        }
        if (u.uid === user.uid) {
          setUserInfo(u);
          if ( u.role=== 1) {
            setRoleText('Pretend to be clicking, tapping or thinking :)');
          } else if (u.role === 2) {
            setRoleText('Mafia, pick someone to kill.');
          } else if (u.role === 3) {
            setRoleText('Detective, who do you want to check tonight?');
          } else if (u.role === 4) {
            setRoleText('Doctor, who do you want to save tonight?');
          }
        }
      });
      // This is probably not best practice, tell me if you have better idea
      // I think this should probably be done in Room.js?
      for (let i = 2; i < 5; i++) {
        if (!roles.has(i)) {
          if (i === 2) {
            room.update({mafiaKill: {uid: '#', displayName: ''}});
          } else if (i === 3) {
            room.update({detectiveCheck: {uid: '#', displayName: ''}});
          } else {
            room.update({doctorSave: {uid: '#', displayName: ''}});
          }
        }
      }
      setPlayers(allPlayers);
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
    if (userInfo.role === 2) {
      if (mafiaKill['uid'] === '') {
        room.update(
            {mafiaKill: {uid: player.uid, displayName: player.displayName}});
        setMessage('You have killed ' + player.displayName + ' tonight.');
      } else if (room.mafiaKill !== player.uid) {
        setMessage('You have already chosen ' +
        mafiaKill['displayName'] + ' to kill tonight.');
      }
    }
    if (userInfo.role === 3) {
      if (detectiveCheck['uid'] === '') {
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
    } else if (userInfo.role === 4) {
      if (doctorSave['uid'] === '') {
        room.update(
            {doctorSave: {uid: player.uid, displayName: player.displayName}});
        setMessage('You have saved ' + player.displayName + ' tonight.');
      } else if (room.doctorSave !== player.uid) {
        setMessage('You have already chosen ' +
        doctorSave['displayName'] + ' to save tonight.');
      }
    }
  }

  return (
    <Grid className={classes.gameContainer} item>
      <PersonalInfo
        name={userInfo.displayName}
        role={userInfo.role}
        alive={userInfo.alive}
      />
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
  user: PropTypes.object,
  usersData: PropTypes.array,
  room: PropTypes.object,
  mafiaKill: PropTypes.object,
  doctorSave: PropTypes.object,
  detectiveCheck: PropTypes.object,
};
