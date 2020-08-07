import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {
  useFirestore,
  useUser,
  useFirestoreCollectionData,
} from 'reactfire';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Player from './Player';
import PersonalInfo from './PersonalInfo';

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
export default function MafiaNight() {
  const classes = useStyles();
  const user = useUser();
  const [initialize, setInitialize] = React.useState(false);
  const [players, setPlayers] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState('');
  const [roleText, setRoleText] = React.useState('');
  const {roomId} = useParams();
  const room = useFirestore().collection('rooms').doc(roomId);
  const usersCollection = room.collection('users');
  const usersData = useFirestoreCollectionData(usersCollection);

  /**
   * @return {undefined}
   */
  function loadNightData() {
    if (initialize === false) {
      setInitialize(true);
      const allPlayers = [];
      usersData.forEach(function(u) {
        if (u.alive === true) {
          allPlayers.push(u);
        }
        if (u.uid === user.uid) {
          setUserInfo(u);
        }
      });
      setPlayers(allPlayers);
      if (userInfo.role === 1) {
        setRoleText('Pretend to be clicking or thinking :)');
      } else if (userInfo.role === 2) {
        setRoleText('Mafia, pick someone to kill.');
      } else if (userInfo.role === 3) {
        setRoleText('Detective, who do you want to check tonight?');
      } else if (userInfo.role === 4) {
        setRoleText('Doctor, who do you want to save tonight?');
      }
    }
  }
  /**
   * Load the all the mafia related data
   */
  useEffect(loadNightData, [initialize]);

  function handleClick(u) {
    console.log('You choose ' + u.displayName);
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
        </Box>
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
      </Box>
    </Grid>
  );
}

