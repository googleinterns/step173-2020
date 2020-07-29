import React, {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import {
  useFirestore,
  useFirestoreDocData,
  useUser,
  useFirestoreCollectionData,
} from 'reactfire';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import UserVideo from '../common/UserVideo';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

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
  inRoomBtns: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

/**
 * @return {ReactElement} Waiting room element
 */
export default function WaitingRoom() {
  const classes = useStyles();
  const {uid, displayName, email} = useUser();
  const {roomId} = useParams();
  const room = useFirestore().collection('rooms').doc(roomId);
  const roomData = useFirestoreDocData(room);
  const usersCollection = room.collection('users');
  const usersData = useFirestoreCollectionData(usersCollection);
  const prevUsersData = usePrevious(usersData);
  const game = useFirestoreDocData(
      useFirestore().collection('games').doc(roomData.gameId),
  );
  const [open, setOpen] = useState(false);
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
      }
      if (usersLeft.length > 0) {
        setOpen(false);
        setMessage(`${usersLeft[0].displayName} left the room`);
      }
      setOpen(true);
    }
  }, [usersData, prevUsersData]);

  /**
   * Add user to the users collection in the room
   */
  function joinRoom() {
    usersCollection.doc(uid).set({displayName, email, uid});
  }

  /**
   * Delete user from user collection in the room
   */
  function leaveRoom() {
    usersCollection.doc(uid).delete();
  }

  return (
    <div>
      <Grid className={classes.main} container>
        <Grid className={classes.gameContainer} item xs={9}>
          <div className={classes.title}>
            <Typography variant="h3" className={classes.fonts}>
              {game.Name}
            </Typography>
          </div>
          <div className={classes.game}>
            <div>
              <Typography variant='body1'>
                {game.description}
              </Typography>
            </div>
          </div>
          <div className={classes.actionBtns}>
            {
              usersData.some((user) => user.uid === uid) ?
                (
                  <div className={classes.inRoomBtns}>
                    { roomData.host === uid ?
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
          {
            usersData.map((user) => {
              return (
                <UserVideo
                  key={user.uid}
                  user={user.displayName}
                />
              );
            })
          }
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
    </div>
  );
}
