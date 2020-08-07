import React, {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import {
  useFirestore,
  useFirestoreDocData,
  useUser,
  useFirestoreCollectionData,
  useAuth,
} from 'reactfire';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import UserVideo from '../common/UserVideo';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import firebase from 'firebase/app';
import Paper from '@material-ui/core/Paper';
import ChatIcon from '@material-ui/icons/Chat';
import Chat from '../common/Chat';
import NotFound from '../pages/NotFound';
import GameRoom from '../common/GameRoom';
import WaitingRoom from '../common/WaitingRoom';
import {setCurrentUser} from '../redux/actions/currentUserActions';
import {setRoomData} from '../redux/actions/roomDataActions';
import {setUsersData} from '../redux/actions/usersDataActions';

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
  btn: {
    margin: '5px',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  signInContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    background: '#e0e0e0',
    color: 'black',
    borderRadius: '4px 4px 0 0',
  },
  sideMargin10px: {
    margin: '0 10px',
  },
}));

/**
 * @return {ReactElement} Room element
 */
export default function Room() {
  const classes = useStyles();
  const user = useUser();
  const auth = useAuth();
  const {roomId} = useParams();
  const room = useFirestore().collection('rooms').doc(roomId);
  const roomData = useFirestoreDocData(room);
  const usersCollection = room.collection('users');
  const usersData = useFirestoreCollectionData(usersCollection);
  const prevUsersData = usePrevious(usersData);
  const game = useFirestoreDocData(
      useFirestore().collection('games').doc(roomData.gameId || ' '),
  );
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');

  /**
   * Get previous value of variable
   * @param {*} value
   * @return {*} previous value
   */
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  /**
   * Find first difference in arrays
   * @param {Array} array1
   * @param {Array} array2
   * @return {string} user's name or null if no difference exists
   */
  function findDifference(array1, array2) {
    let difference = true;
    for (let i = 0; i < array1.length; i++) {
      for (let j = 0; j < array2.length; j++) {
        if (array1[i].uid === array2[j].uid) {
          difference = false;
          break;
        }
      }
      if (difference) {
        return array1[i].displayName;
      }
      difference = true;
    }
    return null;
  }

  /**
   * Open snackbar when user joins or leaves
   */
  function userSnackbar() {
    if (prevUsersData) {
      const userJoined = findDifference(usersData, prevUsersData);
      const userLeft = findDifference(prevUsersData, usersData);
      if (userJoined) {
        if (open) {
          setOpen(false);
        }
        setMessage(`${userJoined} joined the room`);
        setOpen(true);
      }
      if (userLeft) {
        if (open) {
          setOpen(false);
        }
        setMessage(`${userLeft} left the room`);
        setOpen(true);
      }
    }
  }

  useEffect(userSnackbar, [usersData, prevUsersData]);

  useEffect(() => {
    setUsersData(usersData);
  }, [usersData]);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    setRoomData(roomData);
  }, [roomData]);

  /**
   * Add user to the users collection in the room
   */
  function joinRoom() {
    usersCollection.doc(user.uid).set({
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
      role: null,
      alive: true,
      order: Math.floor(Math.random() * 20),
    });
  }

  /**
   * Brings up a Google sign in popup
   * @return {void}
   */
  async function signIn() {
    await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  };

  /**
   * Delete user from user collection in the room
   */
  function leaveRoom() {
    usersCollection.doc(user.uid).delete();
  }

  /**
   * Update the game to start
   */
  function startGame() {
    room.update({
      day: false,
      doctorSave: null,
      mafiaKill: null,
      started: true,
    }).catch(function(error) {
      console.error('Error starting game: ', error);
    });
  }

  /**
   * Check if obj is empty
   * @param {object} obj
   * @return {boolean} if obj is empty
   */
  function isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  if (isEmpty(roomData)) {
    return (
      <NotFound />
    );
  } else {
    return (
      <div>
        { user ?
          <div>
            <Grid className={classes.main} container>
              <Grid className={classes.gameContainer} item xs={9}>
                { roomData.started ?
                  <GameRoom
                    gameRules={game.description}
                    roomData={roomData}
                  /> :
                  <WaitingRoom
                    usersData={usersData}
                    gameName={game.Name}
                    gameDescription={game.description}
                    leaveRoom={leaveRoom}
                    joinRoom={joinRoom}
                    inRoom={usersData.some((u) => u.uid === user.uid)}
                    isHost={roomData.host === user.uid}
                    usersCollection={usersCollection}
                    startGame={startGame}
                    roomData={roomData}
                  />
                }
              </Grid>
              <Grid className={classes.video} item xs={3}>
                <div className={classes.flexColumn}>
                  <div className={classes.grow}>
                    {
                      usersData.map((u) => {
                        return (
                          <UserVideo
                            key={u.uid}
                            user={u.displayName}
                          />
                        );
                      })
                    }
                  </div>
                  <Paper>
                    <div
                      className={classes.chatHeader}
                      onClick={() => setChatOpen(!chatOpen)}
                    >
                      <ChatIcon className={classes.sideMargin10px}/>
                      <Typography variant="h6">Chat</Typography>
                    </div>
                    <Chat
                      open={chatOpen}
                      messages={roomData.chat}
                      roomId={roomId}
                      user={user.displayName}
                    />
                  </Paper>
                </div>
              </Grid>
            </Grid>
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={open}
              autoHideDuration={2000}
              onClose={() => setOpen(false)}
              message={message}
              action={
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => setOpen(false)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            />
          </div> :
          <div className={classes.signInContainer}>
            <Button
              onClick={signIn}
              variant="contained"
              color="primary"
              className={classes.btn}
            >
              Sign In
            </Button>
            <Typography variant="subtitle1">
              You must sign in to join a game room
            </Typography>
          </div>
        }
      </div>
    );
  }
}
