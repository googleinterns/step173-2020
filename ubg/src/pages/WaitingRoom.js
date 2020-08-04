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
  table: {
    height: '300px',
    width: '300px',
    color: 'white',
    background: 'black',
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
 * @return {ReactElement} Waiting room element
 */
export default function WaitingRoom() {
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

  useEffect(() => {
    if (prevUsersData) {
      const usersJoined = usersData.filter((x) => !prevUsersData.includes(x));
      const usersLeft = prevUsersData.filter((x) => !usersData.includes(x));
      if (usersJoined.length > 0) {
        setOpen(false);
        setMessage(`${usersJoined[0].displayName} joined the room`);
        setOpen(true);
      }
      if (usersLeft.length > 0) {
        setOpen(false);
        setMessage(`${usersLeft[0].displayName} left the room`);
        setOpen(true);
      }
    }
  }, [usersData, prevUsersData]);

  /**
   * Add user to the users collection in the room
   */
  function joinRoom() {
    usersCollection.doc(user.uid).set({
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
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
   * Check if obj is empty
   * @param {object} obj
   * @return {boolean} if obj is empty
   */
  function isEmpty(obj) {
    for (let key in obj) {
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
                <div className={classes.title}>
                  <Typography variant="h3" className={classes.fonts}>
                    {game.Name}
                  </Typography>
                </div>
                <div className={classes.game}>
                  <Typography variant='body1'>
                    {game.description}
                  </Typography>
                </div>
                <div className={classes.actionBtns}>
                  {
                    usersData.some((u) => u.uid === user.uid) ?
                      (
                        <div className={classes.inRoomBtns}>
                          { roomData.host === user.uid ?
                            <Button
                              className={classes.btn}
                              variant="contained"
                              color="primary"
                            >Start Game</Button> :
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
