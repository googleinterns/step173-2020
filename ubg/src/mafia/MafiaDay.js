import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Player from './Player';
import PersonalInfo from './PersonalInfo';
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
}));

/**
 * @return {ReactElement} Mafia day element
 */
function MafiaDay({mafiaKill, doctorSave, usersData, usersCollection,
  userUid, room, dayVote, aliveNum, end, showResult}) {
  const classes = useStyles();
  const [players, setPlayers] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState('');
  const [deathText, setDeathText] = useState('');
  const [choice, setChoice] = useState('');
  const [voted, setVoted] = useState(false);
  const [win, setWin] = useState(0);
  const [initialize, setInitialize] = useState(false);

  /**
   * Determines if game has reached end
   */
  function endGame() {
    // all mafia are dead
    if (!usersData.some((player) => player.role === 2 &&
        player.alive === true)) {
      setWin(1);
      room.update({
        end: true,
      });
    // all townspeople are dead
    } else if (!usersData.some((player) => player.role !== 2 &&
        player.alive === true)) {
      setWin(2);
      room.update({
        end: true,
      });
    }
  }

  /**
   * Sets up daytime data and logistics
   * @return {undefined}
   */
  function startDay() {
    endGame();
    if (!end && !initialize) {
      const allPlayers = [];
      if (mafiaKill && mafiaKill.uid !== doctorSave.uid) {
        usersCollection.doc(mafiaKill.uid).update({alive: false});
        setDeathText(mafiaKill.displayName + ' was killed last night');
        aliveNum -= 1;
      } else {
        setDeathText('No one was killed last night');
      }
      usersData.forEach(function(u) {
        if (u.uid === userUid) {
          setUserInfo(u);
        }
        // if usersData wasn't updated from last night's kill
        if ((u.alive === true) &&
          (u.uid !== mafiaKill || mafiaKill.uid === doctorSave.uid)) {
          allPlayers.push(u);
        }
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
      let executedPlayer = [];
      dayVote.forEach((vote) => {
        if (!voteMap.has(vote.vote)) {
          voteMap.set(vote.vote, 0);
        }
        voteMap.set(vote.vote, voteMap.get(vote.vote) + 1);
      });
      executedPlayer = [...voteMap.entries()].reduce((playerOne, playerTwo) =>
        // if tie, choose player with highest ordering
        (playerOne[1] === playerTwo[1] ?
          (playerOne[0].order > playerTwo[0].order ?
            playerOne : playerTwo) :
          (playerOne[1] > playerTwo[1] ?
            playerOne : playerTwo)));
      usersCollection.doc(executedPlayer[0].uid).update({
        alive: false,
      });
      aliveNum -= 1;
      showResult(executedPlayer[0].name + ' was executed. ' +
        executedPlayer[0].role === 2 ?
        'They were mafia.' : 'They were a townsperson.');
      endGame();
      if (!end) {
        room.update({
          doctorSave: {'uid': '', 'displayName': ''},
          mafiaKill: {'uid': '', 'displayName': ''},
          mafiaDecision: [],
          detectiveCheck: {'uid': '', 'displayName': ''},
          day: false,
          dayVote: [],
          aliveCount: aliveNum,
        });
      }
    }
  }

  useEffect(startDay, [usersData]);
  useEffect(startNight, [dayVote]);

  /**
   * Sets the voting choice for current user
   * @param {object} player Clicked on user object
   */
  function confirmVote() {
    if (!voted) {
      const newVote = {
        player: userInfo.displayName,
        vote: {
          uid: choice.uid,
          name: choice.displayName,
        },
      };
      const today = new Date();
      const hours = today.getUTCHours();
      const minutes = today.getUTCMinutes();
      room.update({
        dayVote: firebase.firestore.FieldValue.arrayUnion(newVote),
      });
      setVoted(true);
      room.update({
        chat: firebase.firestore.FieldValue.arrayUnion(
            {text: userInfo.displayName + ' voted for ' + choice.displayName,
              hours, minutes},
        ),
      });
    } else {
      showResult('You have already voted for ' + choice.displayName);
    }
  }

  return (
    <Grid className={classes.gameContainer} item>
      <PersonalInfo
        name={userInfo.displayName}
        role={userInfo.role}
        alive={userInfo.alive}
      />
      { win === 0 ?
        <Box m={10}>
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
              disabled={!userInfo.alive}
            >
              Confirm Vote
            </Button>
          </Grid>
        </Box> :
        win === 1 ?
        <Box>
          <Grid container justify="center" alignItems="center">
            <h1>Town won!</h1>
          </Grid>
        </Box> :
        <Box>
          <Grid container justify="center" alignItems="center">
            <h1>Mafia won!</h1>
          </Grid>
        </Box>
      }
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
  end: PropTypes.bool,
  showResult: PropTypes.func,
};

const mapStateToProps = (state) => ({
  userUid: state.currentUser.uid,
  usersData: state.usersData,
  dayVote: state.roomData.dayVote,
  mafiaKill: state.roomData.mafiaKill,
  doctorSave: state.roomData.doctorSave,
  aliveNum: state.roomData.aliveCount,
  end: state.roomData.end,
});

export default connect(
    mapStateToProps,
    {},
)(MafiaDay);
