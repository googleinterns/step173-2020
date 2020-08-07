import React, {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import {
  useFirestore,
  useFirestoreDocData,
  useUser,
  useFirestoreCollectionData,
  // useAuth,
} from 'reactfire';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import UserVideo from '../common/UserVideo';
// import Snackbar from '@material-ui/core/Snackbar';
// import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';
import Player from './Player';
import PersonalInfo from './PersonalInfo';
// import firebase from 'firebase/app';
// import Paper from '@material-ui/core/Paper';
// import ChatIcon from '@material-ui/icons/Chat';
// import Chat from '../common/Chat';
// import NotFound from '../pages/NotFound';

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
  text: {
    
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
  const ref = useFirestore().collection('games');
  const [initialize, setInitialize] = React.useState(false);
  const [players, setPlayers] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState('');
  const {roomId} = useParams();
  const room = useFirestore().collection('rooms').doc(roomId);
  const roomData = useFirestoreDocData(room);
  const usersCollection = room.collection('users');
  const usersData = useFirestoreCollectionData(usersCollection);

  /**
 * @return {undefined}
 */
function loadData() {
  // using a hack to load data and reset filters when needed
  if (initialize === false) {
    setInitialize(true);
    console.log(roomData);
    console.log(usersData);
    const allPlayers = [];
    usersData.forEach(function(u) {
      if (u.alive === true) {
          allPlayers.push(u);
      }
      if (u.uid == user.uid) {
        setUserInfo(u);
      }
  });
  setPlayers(allPlayers);
  }
}
/**
 * Load the games data according to filter
 */
useEffect(loadData, [initialize]);
  return (
    <Grid className={classes.gameContainer} item >

                <PersonalInfo name={userInfo.displayName} role={userInfo.role} alive={userInfo.alive}/>
                <Box m={10}>
                  <Box className={classes.text} my={15} justify="center" mx="auto">
                    <h2>Choose a person to kill...</h2>
                    
                  </Box>
                  <Grid container justify="center" alignItems="center" spacing={4}>
                  {
                      players.map((u) => {
                        return (
                          <Player
                          key={u.uid}
                            name={u.displayName}
                            // role={u.role}
                          />
                        );
                      })
                    }
                  </Grid>
                </Box>
              </Grid>
    
  );
}
