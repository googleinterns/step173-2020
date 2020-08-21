import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Player from './Player';
import PropTypes from 'prop-types';
import * as firebase from 'firebase/app';
import {connect} from 'react-redux';

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
  voteBtn: {
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  mainActivity: {
    flexGrow: 1,
    height: '300px',
  },
  confirmChoice: {
    marginBottom: '70px',
  },
}));

/**
 * @return {ReactElement} Mafia day element
 */
function MafiaDay({mafiaKill, doctorSave, usersData, usersCollection,
  userUid, room, dayVote, aliveNum, showResult, endGame, dayNum}) {
  const classes = useStyles();
  const [players, setPlayers] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState('');
  const [deathText, setDeathText] = useState('');
  const [choice, setChoice] = useState('');
  const [initialize, setInitialize] = useState(false);

  /**
   * Sets up daytime data and logistics
   * @return {undefined}
   */
  function startDay() {
    endGame();
    setUserInfo(usersData.find((u) => u.uid === userUid));
    if (!initialize) {
      const allPlayers = [];
      const today = new Date();
      const hours = today.getUTCHours();
      const minutes = today.getUTCMinutes();
      if (mafiaKill && mafiaKill.uid !== doctorSave.uid) {
        let deathText = mafiaKill.displayName + ' was killed last night. ';
        switch (usersData.find((u) => u.uid === mafiaKill.uid).role) {
          case 1:
            deathText += 'They were a villager.';
            break;
          case 2:
            deathText += 'They were mafia.';
            break;
          case 3:
            deathText += 'They were a detective.';
            break;
          case 4:
            deathText += 'They were a doctor.';
            break;
          default:
            deathText = 'No one was killed last night.';
        }
        setDeathText(deathText);
      } else {
        setDeathText('No one was killed last night');
      }
      usersData.forEach(function(u) {
        if (u.alive === true) {
          allPlayers.push(u);
        }
      });
      room.update({
        chat: firebase.firestore.FieldValue.arrayUnion(
            {text: '-------- DAY ' + dayNum + ' --------',
              isGameText: true, hours, minutes},
        ),
      });
      setPlayers(allPlayers);
      setInitialize(true);
    }
  }

  /**
   * Transitions to nighttime when voting is completed
   * @return {undefined}
   */
  function startNight() {
    if (dayVote.length === aliveNum) {
      const voteMap = new Map();
      const today = new Date();
      const hours = today.getUTCHours();
      const minutes = today.getUTCMinutes();
      let executedPlayer = [];
      dayVote.forEach((vote) => {
        if (!voteMap.has(vote)) {
          voteMap.set(vote, 0);
        }
        voteMap.set(vote, voteMap.get(vote) + 1);
      });
      const entries = [...voteMap.entries()];
      entries.sort(function(a, b) {
        return b[1] - a[1];
      });
      executedPlayer = entries[0];
      usersCollection.doc(executedPlayer[0].uid).update({
        alive: false,
      });
      usersCollection.doc(userUid).update({
        chose: false,
      });
      aliveNum -= 1;
      dayNum += 1;
      let executionMessage = executedPlayer[0].name + ' was executed. ';
      switch (executedPlayer[0].role) {
        case 1:
          executionMessage += 'They were a villager.';
          break;
        case 2:
          executionMessage += 'They were mafia.';
          break;
        case 3:
          executionMessage += 'They were a detective.';
          break;
        case 4:
          executionMessage += 'They were a doctor.';
          break;
        default:
          executionMessage = 'No one was executed.';
      }
      showResult(executionMessage);
      room.update({
        doctorSave: {'uid': '', 'displayName': ''},
        mafiaKill: {'uid': '', 'displayName': ''},
        mafiaDecision: [],
        detectiveCheck: {'uid': '', 'displayName': ''},
        day: false,
        dayVote: [],
        aliveCount: aliveNum,
        dayCount: dayNum,
        chat: firebase.firestore.FieldValue.arrayUnion(
            {text: executionMessage, isGameText: true, hours, minutes},
        ),
      });
    }
  }

  useEffect(startDay, [usersData]);
  useEffect(startNight, [dayVote]);

  /**
   * Sets the voting choice for current user
   * @param {object} player Clicked on user object
   */
  function confirmVote() {
    const today = new Date();
    const hours = today.getUTCHours();
    const minutes = today.getUTCMinutes();
    room.update({
      dayVote: firebase.firestore.FieldValue.arrayUnion({
        player: userUid,
        uid: choice.uid,
        name: choice.displayName,
        role: choice.role,
      }),
      chat: firebase.firestore.FieldValue.arrayUnion(
          {text: userInfo.displayName + ' voted for ' + choice.displayName,
            isGameText: true, hours, minutes},
      ),
    });
    room.collection('users').doc(userInfo.uid).update({
      chose: true,
    });
  }

  return (
    <Grid className={classes.gameContainer} item>
      <Box className={classes.mainActivity} m={10}>
        <Grid container justify="center" alignItems="center">
          <h2>{deathText}</h2>
        </Grid>
        <Grid container justify="center" alignItems="center">
          <h3>You may discuss and vote on who to execute</h3>
        </Grid>
        <br />
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
            onClick={confirmVote}
            className={classes.confirmChoice}
            disabled={!userInfo.alive || usersData.find((u) =>
              u.uid === userUid).chose}
          >
            Confirm Vote
          </Button>
        </Grid>
      </Box>
    </Grid>
  );
}

MafiaDay.propTypes = {
  userUid: PropTypes.string,
  userAlive: PropTypes.bool,
  usersData: PropTypes.array,
  usersCollection: PropTypes.object,
  room: PropTypes.object,
  dayVote: PropTypes.array,
  mafiaKill: PropTypes.object,
  doctorSave: PropTypes.object,
  aliveNum: PropTypes.number,
  showResult: PropTypes.func,
  endGame: PropTypes.func,
  dayNum: PropTypes.number,
};

const mapStateToProps = (state) => ({
  userUid: state.currentUser.uid,
  usersData: state.usersData,
  dayVote: state.roomData.dayVote,
  mafiaKill: state.roomData.mafiaKill,
  doctorSave: state.roomData.doctorSave,
  aliveNum: state.roomData.aliveCount,
  dayNum: state.roomData.dayCount,
});

export default connect(
    mapStateToProps,
    {},
)(MafiaDay);
