import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Player from './Player';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as firebase from 'firebase/app';

const useStyles = makeStyles((theme) => ({
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
  mainActivity: {
    marginTop: '10vh',
    flexGrow: 1,
    height: '300px',
  },
  confirmChoice: {
    marginBottom: '70px',
  },
}));

/**
 * @return {ReactElement} Mafia night element
 */
function MafiaNight({userUid, usersData, room, usersCollection, aliveNum,
  mafiaKill, doctorSave, detectiveCheck, showResult, mafiaDecision,
  endGame, dayNum, chat, win}) {
  const classes = useStyles();
  const [players, setPlayers] = useState([]);
  const [userInfo, setUserInfo] = useState('');
  const [roleText, setRoleText] = useState('');
  const [choice, setChoice] = useState('');
  // If mafia, whether chosen someone to kill
  const [chose, setChose] = useState(false);
  const [mafiaTotal, setMafiaTotal] = useState(0);
  const [message, setMessage] = useState('');
  const [initialize, setInitialize] = useState(false);


  /**
   * @return {undefined}
   */
  function loadNightData() {
    endGame();
    setUserInfo(usersData.find((u) => u.uid === userUid));
    if (!initialize && (!win || win === 0)) {
      setInitialize(true);
      const roles = new Set();
      const allPlayers = [];
      const today = new Date();
      const hours = today.getUTCHours();
      const minutes = today.getUTCMinutes();
      let totalMafia = 0;
      usersData.forEach(function(u) {
        if (u.alive === true) {
          roles.add(u.role);
          allPlayers.push(u);
          if (u.role === 2) {
            totalMafia += 1;
          }
        }
        if (u.uid === userUid) {
          setUserInfo(u);
          setChose(u.chose);
          if (u.alive === true) {
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
          } else {
            setRoleText('Sorry but you are dead :/');
          }
        }
      });
      setMafiaTotal(totalMafia);
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
      // dayNum can show up as undefined on first night
      dayNum = dayNum ? (initialize ? 1 : dayNum) : 1;
      if (!chat.includes('-------- NIGHT ' + dayNum + ' --------')) {
        room.update({
          chat: firebase.firestore.FieldValue.arrayUnion(
              {text: '-------- NIGHT ' + dayNum + ' --------',
                isGameText: true, hours, minutes},
          ),
        });
      }
      endGame();
    }
  }
  /**
   * Check if all mafias decide to kill the same person
   * @return {undefined}
   */
  function mafiaVote() {
    if (userInfo.role === 2) {
      if (mafiaDecision && mafiaDecision.length !== 0 &&
        mafiaDecision.length === mafiaTotal) {
        const today = new Date();
        const hours = today.getUTCHours();
        const minutes = today.getUTCMinutes();
        const killed = mafiaDecision[0].vote.uid;
        for (let i = 1; i < mafiaTotal; i++) {
          if (mafiaDecision[i].vote.uid !== killed) {
            setMessage('All mafia must choose the same person to die! ' +
            'Please vote again');
            room.update({
              mafiaDecision: [],
              mafiaChat: firebase.firestore.FieldValue.arrayUnion(
                  {text: 'Mafia please vote again', isGameText: true,
                    hours, minutes},
              ),
            });
            changeChose(false);
            return;
          }
        }
        room.update({
          mafiaKill: mafiaDecision[0].vote,
          mafiaChat: firebase.firestore.FieldValue.arrayUnion(
              {text: 'Mafia agreed to kill ' +
              mafiaDecision[0].vote.displayName, isGameText: true,
              hours, minutes},
          ),
        });
        setMessage('Please wait for other players before jumping to day.');
      }
    }
  }
  /**
   * @return {undefined}
   */
  function endNight() {
    if (mafiaKill &&
      doctorSave &&
      detectiveCheck &&
      mafiaKill.uid !== '' &&
      doctorSave.uid !== '' &&
      detectiveCheck.uid !== '') {
      if (mafiaKill && mafiaKill.uid !== doctorSave.uid) {
        usersCollection.doc(mafiaKill.uid).update({alive: false});
        aliveNum -= 1;
      }
      usersCollection.doc(userUid).update({
        chose: false,
      });
      room.update({
        day: true,
        aliveCount: aliveNum,
      });
    }
  }
  /**
   * Load the all the mafia related data
   */
  useEffect(loadNightData, []);
  useEffect(mafiaVote, [mafiaDecision]);
  useEffect(endNight, [mafiaKill, doctorSave, detectiveCheck]);

  /**
   * @return {undefined}
   */
  function confirmClick() {
    if (choice !== '') {
      handleClick(choice);
    }
  }
  /**
   * @param {object} player information of player
   * @return {undefined}
   */
  function handleClick(player) {
    switch (userInfo.role) {
      case 2:
        const newVote = {
          player: userInfo.displayName,
          vote: {
            uid: player.uid,
            displayName: player.displayName,
          },
        };
        const today = new Date();
        const hours = today.getUTCHours();
        const minutes = today.getUTCMinutes();
        room.update({
          mafiaDecision: firebase.firestore.FieldValue.arrayUnion(newVote),
          mafiaChat: firebase.firestore.FieldValue.arrayUnion(
              {text: newVote.player + ' voted for ' + player.displayName,
                isGameText: true, hours, minutes},
          ),
        });
        changeChose(true);
        setMessage('You have chose to kill ' + player.displayName);
        break;
      case 3:
        if (player.role === 2) {
          showResult('This person is bad.');
        } else {
          showResult('This person is good.');
        }
        room.update(
            {detectiveCheck:
            {uid: player.uid, displayName: player.displayName}});
        changeChose(true);
        setMessage('Please wait for other players before jumping to day.');
        break;
      case 4:
        room.update(
            {doctorSave: {uid: player.uid, displayName: player.displayName}});
        showResult('You have saved ' + player.displayName + ' tonight.');
        setMessage('Please wait for other players before jumping to day.');
        changeChose(true);
        break;
      default:
        setMessage('Role is invalid.');
    }
  }
  /**
   * Set whether player has chosen in database
   * @param {boolean} chosed
   * @return {undefined}
   */
  function changeChose(chosed) {
    setChose(chosed);
    room.collection('users').doc(userInfo.uid).update({
      chose: chosed,
    });
  }

  return (
    <Grid className={classes.gameContainer} item>
      <Box className={classes.mainActivity} m={10}>
        <Grid container justify="center" alignItems="center">
          <h2>{roleText}</h2>
        </Grid>
        <Grid container justify="center" alignItems="center">
          <h2>{message}</h2>
        </Grid>
        <br />
        {userInfo.role === 1 || userInfo.alive === false ? null :
        <div>
          <Grid container justify="center" alignItems="center" spacing={4}>
            {
              players.map((u) => {
                return (
                  <Player
                    key={u.uid}
                    player={u}
                    setChoice={setChoice}
                    choice={choice}
                    user={userInfo}
                  />
                );
              })
            }
          </Grid>
          <br /> <br />
          <Grid container justify="center" alignItems="center">
            <Button
              variant="contained"
              color="primary"
              onClick={confirmClick}
              disabled={chose}
              className={classes.confirmChoice}
            >
              Confirm Choice
            </Button>
          </Grid>
        </div>
        }
      </Box>
    </Grid>
  );
}

MafiaNight.propTypes = {
  userUid: PropTypes.string,
  usersData: PropTypes.array,
  usersCollection: PropTypes.object,
  room: PropTypes.object,
  aliveNum: PropTypes.number,
  mafiaKill: PropTypes.object,
  doctorSave: PropTypes.object,
  detectiveCheck: PropTypes.object,
  showResult: PropTypes.func,
  mafiaDecision: PropTypes.array,
  endGame: PropTypes.func,
  dayNum: PropTypes.number,
  chat: PropTypes.array,
  win: PropTypes.number,
};

const mapStateToProps = (state) => ({
  userUid: state.currentUser.uid,
  usersData: state.usersData,
  aliveNum: state.roomData.aliveCount,
  mafiaKill: state.roomData.mafiaKill,
  doctorSave: state.roomData.doctorSave,
  detectiveCheck: state.roomData.detectiveCheck,
  mafiaDecision: state.roomData.mafiaDecision,
  dayNum: state.roomData.dayCount,
  chat: state.roomData.chat,
  win: state.roomData.win,
});

export default connect(
    mapStateToProps,
    {},
)(MafiaNight);
