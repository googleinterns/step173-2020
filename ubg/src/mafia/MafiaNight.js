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
export default function MafiaNight({user, room, usersData, usersCollection}) {
  const classes = useStyles();
  const [players, setPlayers] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState('');
  const [roleText, setRoleText] = React.useState('');
  const [message, setMessage] = React.useState('');

  /**
   * @return {undefined}
   */
  function loadNightData() {
    const allPlayers = [];
    usersData.forEach(function(u) {
      if (u.alive === true) {
        allPlayers.push(u);
      }
      if (u.uid === user.uid) {
        setUserInfo(u);
        if ( u.role=== 1) {
          setRoleText('Pretend to be clicking or thinking :)');
        } else if (u.role === 2) {
          setRoleText('Mafia, pick someone to kill.');
        } else if (u.role === 3) {
          setRoleText('Detective, who do you want to check tonight?');
        } else if (u.role === 4) {
          setRoleText('Doctor, who do you want to save tonight?');
        }
      }
    });
    setPlayers(allPlayers);
  }
  /**
   * Load the all the mafia related data
   */
  useEffect(loadNightData, []);
  /**
   * @param {object} player information of player
   * @return {undefined}
   */
  function handleClick(player) {
    if (userInfo.role === 2) {
      if (room.mafiaKill === '') {
        room.update({mafiaKill:player.uid});
      } else if (room.mafiaKill !== player.uid) {
        setMessage('Mafias have already chosen the person to kill. which is .')
      }
    }
    if (userInfo.role === 3) {
      if (player.role === 2) {
        setMessage('This person is bad.');
      } else {
        setMessage('This person is good.');
      }
    } else if (userInfo.role === 4) {
      room.update({doctorSave:player.uid});
    }
    console.log('You choose ' + player.displayName);
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
};
