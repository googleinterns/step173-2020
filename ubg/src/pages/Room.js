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
import {connect} from 'react-redux';
import {setCurrentUser} from '../redux/actions/currentUserActions';
import {setRoomData} from '../redux/actions/roomDataActions';
import {setUsersData} from '../redux/actions/usersDataActions';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
const classNames = require('classnames');

const useStyles = makeStyles((theme) => ({
  main: {
    height: '100vh',
    maxHeight: '100vh',
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
    color: 'black',
    borderRadius: '4px 4px 0 0',
    cursor: 'pointer',
  },
  sideMargin10px: {
    margin: '0 10px',
  },
  chatsHeaders: {
    display: 'flex',
  },
  halfWidth: {
    background: '#a6a6a6',
    width: '50%',
  },
  fullWidth: {
    background: '#e0e0e0',
    width: '100%',
  },
  transparentBackground: {
    backgroundColor: 'transparent',
  },
  chatSelected: {
    backgroundColor: '#e0e0e0',
  },
}));

/**
 * @return {ReactElement} Room element
 */
function Room({setUsersData, setCurrentUser, setRoomData}) {
  const classes = useStyles();
  const history = useHistory();
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
  const mafiaChat =
    roomData.gameId === '925' &&
    roomData.started &&
    user &&
    isMafia(user.uid);
  const [mafiaChatSelected, setMafiaChatSelected] = useState(false);

  const chatClasses = classNames({
    [classes.chatHeader]: true,
    [classes.fullWidth]: !mafiaChat,
    [classes.halfWidth]: mafiaChat,
    [classes.chatSelected]: !mafiaChatSelected && mafiaChat,
  });
  const mafiaChatClasses = classNames({
    [classes.chatHeader]: true,
    [classes.halfWidth]: true,
    [classes.chatSelected]: mafiaChatSelected,
  });
  const [inGame] = useState(user && usersData.some((u) => u.uid === user.uid));

  /**
   * Go to the home page url
   */
  function homePage() {
    history.push('/');
  }

  /**
   * Check if current user is mafia
   * @param {string} uid
   * @return {boolean} mafia or not
   */
  function isMafia(uid) {
    for (let i = 0; i < usersData.length; i++) {
      if (usersData[i].uid === uid) {
        if (usersData[i].role === 2) {
          return true;
        }
        return false;
      }
    }
  }

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
  }, [usersData, setUsersData]);

  useEffect(() => {
    setCurrentUser(user);
  }, [user, setCurrentUser]);

  useEffect(() => {
    setRoomData(roomData);
  }, [roomData, setRoomData]);

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
      chose: false,
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
      win: 0,
      day: false,
      doctorSave: {'uid': '', 'displayName': ''},
      mafiaKill: {'uid': '', 'displayName': ''},
      mafiaDecision: [],
      detectiveCheck: {'uid': '', 'displayName': ''},
      started: true,
      aliveCount: usersData.length,
      mafiaChat: [],
      dayVote: [],
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
                  inGame ?
                  <GameRoom
                    gameRules={game.description}
                    room={room}
                    usersCollection={usersCollection}
                  /> :
                  <div className={classes.signInContainer}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={homePage}
                      className={classes.btn}
                    >
                      Back to Homepage
                    </Button>
                    <Typography variant="subtitle1">
                      You&apos;re too late! The game has already started :/
                    </Typography>
                  </div> :
                  <WaitingRoom
                    gameName={game.Name}
                    gameDescription={game.description}
                    leaveRoom={leaveRoom}
                    joinRoom={joinRoom}
                    inRoom={usersData.some((u) => u.uid === user.uid)}
                    isHost={roomData.host === user.uid}
                    usersCollection={usersCollection}
                    startGame={startGame}
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
                  <Paper className={classes.transparentBackground}>
                    <div className={classes.chatsHeaders}>
                      <div
                        className={chatClasses}
                        onClick={() => {
                          if (mafiaChat) {
                            if (mafiaChatSelected) {
                              setMafiaChatSelected(false);
                              if (!chatOpen) {
                                setChatOpen(true);
                              }
                            } else {
                              setChatOpen(!chatOpen);
                            }
                          } else {
                            setChatOpen(!chatOpen);
                          }
                        }}
                      >
                        <ChatIcon className={classes.sideMargin10px}/>
                        <Typography variant="h6">Chat</Typography>
                      </div>
                      { mafiaChat ?
                        <div
                          className={mafiaChatClasses}
                          onClick={() => {
                            if (mafiaChatSelected) {
                              setChatOpen(!chatOpen);
                            } else {
                              setMafiaChatSelected(true);
                              if (!chatOpen) {
                                setChatOpen(true);
                              }
                            }
                          }}
                        >
                          <ChatIcon className={classes.sideMargin10px}/>
                          <Typography variant="h6">Mafia</Typography>
                        </div> :
                        null
                      }
                    </div>
                    <Chat
                      disabled={(mafiaChatSelected && roomData.day) || !inGame}
                      mafia={mafiaChatSelected}
                      messages={mafiaChatSelected ?
                        roomData.mafiaChat : roomData.chat}
                      open={chatOpen}
                      room={room}
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

Room.propTypes = {
  setCurrentUser: PropTypes.func,
  setRoomData: PropTypes.func,
  setUsersData: PropTypes.func,
};

export default connect(
    null,
    {setCurrentUser, setRoomData, setUsersData},
)(Room);
