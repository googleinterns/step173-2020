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
import socketIOClient from 'socket.io-client';

const classNames = require('classnames');
let socket = null;
let peerConnections = {};
let remoteStreams = {};
let localStream = null;
let uidToSocketId = {};

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
    height: '100px',
    overflow: 'scroll',
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
    zIndex: 1,
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
  const [localAudio, setLocalAudio] = useState(null);
  const [localVideo, setLocalVideo] = useState(null);
  const [inVideoChat, setInVideoChat] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [stateReloadVar, setStateReloadVar] = useState(false);

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

  /**
   * Go to the home page url
   */
  function homePage() {
    history.push('/');
  }

  // Video chat
  const configuration = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  /**
   * Create peer connection and call create offer or answer
   * @param {string} socketId
   * @param {object} offer
   */
  function createPeerConnection(socketId, offer = null) {
    const promise = new Promise(async (resolve, reject) => {
      if (!peerConnections[socketId]) {
        peerConnections[socketId] = await new RTCPeerConnection(configuration);
        localStream.getTracks().forEach((track) => {
          peerConnections[socketId].addTrack(track, localStream);
        });

        remoteStreams[socketId] = await new MediaStream();
        peerConnections[socketId].addEventListener('track', (event) => {
          event.streams[0].getTracks().forEach((track) => {
            remoteStreams[socketId].addTrack(track);
          });
        });

        peerConnections[socketId].addEventListener('icecandidate', (event) => {
          if (!event.candidate) {
            return;
          }
          socket.emit('newICE', event.candidate, socketId);
        });
        if (offer) {
          createAnswer(socketId, offer);
        } else {
          createOffer(socketId);
        }
        resolve();
      } else {
        console.error('connection already exists!');
      }
    });
    promise.then(() => {
      setStateReloadVar(!stateReloadVar);
    });
  }

  /**
   * Create and send offer for peer connection
   * @param {string} socketId
   */
  async function createOffer(socketId) {
    if (peerConnections[socketId]) {
      const offer = await peerConnections[socketId].createOffer();
      await peerConnections[socketId].setLocalDescription(offer);
      socket.emit('sendOffer', offer, socketId, user.uid);
    } else {
      console.error('connection doesnt exists');
    }
  }

  /**
   * Create and send answer for peer connection
   * @param {string} socketId
   * @param {object} offer
   */
  async function createAnswer(socketId, offer) {
    if (peerConnections[socketId]) {
      await peerConnections[socketId].setRemoteDescription(offer);
      const answer = await peerConnections[socketId].createAnswer();
      await peerConnections[socketId].setLocalDescription(answer);
      socket.emit('sendAnswer', answer, socketId);
    } else {
      console.error('connection doesnt exists');
    }
  }

  /**
   * Receive peer connection answer
   * @param {string} socketId
   * @param {object} answer
   */
  async function receiveAnswer(socketId, answer) {
    if (peerConnections[socketId]) {
      await peerConnections[socketId].setRemoteDescription(answer);
    } else {
      console.error('connection doesnt exists');
    }
  }

  /**
   * Receive ICE candidates
   * @param {string} socketId
   * @param {object} candidate
   */
  function receiveICE(socketId, candidate) {
    if (peerConnections[socketId]) {
      peerConnections[socketId].addIceCandidate(candidate);
    }
  }

  /**
   * End connection with the user that left
   * @param {string} socketId
   */
  function userLeft(socketId) {
    if (peerConnections[socketId]) {
      peerConnections[socketId].close();
      peerConnections[socketId] = null;
    }
    if (remoteStreams[socketId]) {
      remoteStreams[socketId].getTracks().forEach((track) => {
        track.stop();
      });
      remoteStreams[socketId] = null;
    }
  }

  /**
   * Toggle local audio
   */
  function toggleAudio() {
    if (localStream) {
      localStream.getAudioTracks()[0].enabled = localAudio;
      usersCollection.doc(user.uid).update({
        hasAudio: localAudio,
      });
    }
  }

  useEffect(toggleAudio, [localAudio]);

  /**
   * Toggle local video
   */
  function toggleVideo() {
    if (localStream) {
      localStream.getVideoTracks()[0].enabled = localVideo;
      usersCollection.doc(user.uid).update({
        hasVideo: localVideo,
      });
    }
  }

  useEffect(toggleVideo, [localVideo]);

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

  /**
   * Start video and join to socket room
   */
  async function startVideoAndJoinSocketRoom() {
    localStream = await navigator.mediaDevices.getUserMedia(
        {video: true, audio: true},
    );
    usersCollection.doc(user.uid).update({
      hasVideo: true,
      hasAudio: true,
    });
    setLocalAudio(true);
    setLocalVideo(true);
    socket.emit('joinSocketRoom', roomId, user.uid);
  }

  /**
   * Emmit leave socket room and end peer concections
   */
  function leaveSocketRoomEndPeerConnection() {
    socket.emit('leaveSocketRoom', roomId);
    Object.keys(remoteStreams).forEach((stream) => {
      if (remoteStreams[stream]) {
        remoteStreams[stream].getTracks().forEach((track) => track.stop());
        remoteStreams[stream] = null;
      }
    });
    remoteStreams = {};
    Object.keys(peerConnections).forEach((connection) => {
      if (peerConnections[connection]) {
        peerConnections[connection].close();
        peerConnections[connection] = null;
      }
    });
    peerConnections = {};
    uidToSocketId = {};
    localStream.getTracks().forEach((track) => {
      track.stop();
    });
    localStream = null;
    try {
      usersCollection.doc(user.uid).update({
        hasVideo: null,
        hasAudio: null,
      });
    } catch (err) {
      console.error(err);
    }
    setLocalAudio(null);
    setLocalVideo(null);
    setStateReloadVar(false);
  }

  /**
   * Handle video chat state change
   */
  function handleVideoChatChange() {
    if (inVideoChat && !localStream) {
      startVideoAndJoinSocketRoom();
    }
    if (!inVideoChat && localStream) {
      leaveSocketRoomEndPeerConnection();
    }
  }

  useEffect(handleVideoChatChange, [inVideoChat]);

  /**
   * handle socket connection
   * @return {func}
   */
  function socketConnection() {
    socket = socketIOClient('/');

    socket.on('newUser', (socketId, uid) => {
      createPeerConnection(socketId);
      uidToSocketId[uid] = socketId;
    });

    socket.on('receiveOffer', (offer, socketId, uid) => {
      createPeerConnection(socketId, offer);
      uidToSocketId[uid] = socketId;
    });

    socket.on('receiveAnswer', (answer, socketId) => {
      receiveAnswer(socketId, answer);
    });

    socket.on('receiveICE', (candidate, socketId) => {
      receiveICE(socketId, candidate);
    });

    socket.on('userLeft', (socketId) => {
      userLeft(socketId);
    });

    return () => socket.disconnect();
  }

  useEffect(socketConnection, []);

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

  useEffect(() => {
    setInRoom(user && usersData.some((u) => u.uid === user.uid));
  }, [user, usersData]);

  window.onbeforeunload = (e) => {
    if (inVideoChat) {
      leaveSocketRoomEndPeerConnection();
    }
  };

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
      exitGame: false,
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
    if (inVideoChat) {
      setInVideoChat(false);
    }
    usersCollection.doc(user.uid).delete();
  }

  /**
   * Update the game to start
   */
  function startGame() {
    room.update({
      win: 0,
      day: false,
      dayCount: 1,
      doctorSave: {'uid': '', 'displayName': ''},
      mafiaKill: {'uid': '', 'displayName': ''},
      mafiaDecision: [],
      detectiveCheck: {'uid': '', 'displayName': ''},
      started: true,
      aliveCount: usersData.length,
      chat: [],
      mafiaChat: [],
      dayVote: [],
    }).catch(function(error) {
      console.error('Error starting game: ', error);
    });
  }

  /**
   * Sets up player to be able to play again
   */
  async function playAgain() {
    await usersCollection.doc(user.uid).update({
      alive: true,
      chose: false,
      order: Math.floor(Math.random() * 20),
    });
    await room.update({
      started: false,
      dayCount: 1,
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
          (
            <div>
              <Grid className={classes.main} container>
                <Grid className={classes.gameContainer} item xs={9}>
                  { roomData.started ?
                    inRoom ?
                    <GameRoom
                      gameRules={game.description}
                      room={room}
                      usersCollection={usersCollection}
                      playAgain={playAgain}
                      leaveRoom={leaveRoom}
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
                        You&apos;re too late! The game has already started.
                      </Typography>
                    </div> :
                    <WaitingRoom
                      gameName={game.Name}
                      gameDescription={game.description}
                      leaveRoom={leaveRoom}
                      joinRoom={joinRoom}
                      inRoom={inRoom}
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
                        inRoom ?
                          <UserVideo
                            video={localStream}
                            key={user.uid}
                            user={user.displayName}
                            videoInfo={{
                              local: true,
                              hasAudio: localAudio,
                              hasVideo: localVideo,
                              toggleAudio: () => setLocalAudio(!localAudio),
                              toggleVideo: () => setLocalVideo(!localVideo),
                            }}
                          /> :
                          null
                      }
                      {
                        usersData.map((u) => {
                          if (u.uid !== user.uid) {
                            return (
                              <UserVideo
                                video={remoteStreams[uidToSocketId[u.uid]]}
                                key={u.uid}
                                user={u.displayName}
                                videoInfo={{
                                  local: false,
                                  hasAudio: u.hasAudio,
                                  hasVideo: u.hasVideo,
                                }}
                              />
                            );
                          } else {
                            return null;
                          }
                        })
                      }
                      {
                        inRoom ?
                        <Button
                          className={classes.btn}
                          variant="contained"
                          onClick={() => setInVideoChat(!inVideoChat)}
                        >{inVideoChat ? 'Leave' : 'Join'} Video Chat</Button> :
                        null
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
                        disabled={(mafiaChatSelected && roomData.day) ||
                          !inRoom ||
                          (!mafiaChatSelected && !roomData.day)}
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
            </div>
          ) :
          (
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
          )
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
