import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Player from './Player';
import PersonalInfo from './PersonalInfo';
import PropTypes from 'prop-types';

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
  }
}));

/**
 * @return {ReactElement} Mafia day element
 */
export default function MafiaDay({mafiaKill, doctorSave,
  usersData, usersCollection, user, room, roomData}) {
  const classes = useStyles();
  const [players, setPlayers] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState('');
  const [deathText, setDeathText] = useState('');
  const [choice, setChoice] = useState('');
  const [voted, setVoted] = useState(false);

  /**
   * Sets up daytime data and logistics
   * @return {undefined}
   */
  function startDay() {
    if (mafiaKill && mafiaKill.uid !== doctorSave.uid) {
      usersCollection.doc(mafiaKill).update({alive: false});
      setDeathText(mafiaKill.displayName + ' was killed by the mafia');
    } else if (mafiaKill && mafiaKill.uid === doctorSave.uid) {
      setDeathText(mafiaKill.displayName + ' was saved by the doctor');
    }
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
    room.update({
      dayVote: [],
    });
  }

  /**
   * Transitions to nighttime when voting is completed
   * @return {undefined}
   */
  function startNight() {
    if (roomData.dayVote.length === 1) {
      let voteMap = new Map();
      let executedPlayer = [];
      roomData.dayVote.forEach((vote) => {
        if (!voteMap.has(vote)) {
          voteMap.set(vote, 0);
        }
        voteMap.set(vote, voteMap.get(vote) + 1);
      });
      console.log(voteMap);
      executedPlayer = [...voteMap.entries()].reduce((playerOne, playerTwo) =>
        (playerOne[0].value === playerTwo[0].value ?
          (playerOne[0].key.order > playerTwo[0].key.order ?
            playerOne : playerTwo) :
          (playerOne[0].value > playerTwo[0].value ?
            playerOne : playerTwo)));
      usersCollection.doc(executedPlayer[0].uid).update({
        alive: false,
      });
      alert(executedPlayer[0].displayName + ' was executed.');
      alert(executedPlayer[0].role === 2 ? 'They were mafia.' : 'They were a townsperson.');
      room.update({
        day: false,
      })
    }
  }

  useEffect(startDay, []);
  useEffect(startNight, [roomData.dayVote]);

  /**
   * Sets the voting choice for current user
   * @param {object} player Clicked on user object
   */
  function confirmVote() {
    if (!voted) {
      roomData.dayVote.push(choice);
      room.update({
        dayVote: roomData.dayVote,
      })
      setVoted(true);
    } else {
      alert('You have voted for ' + choice.displayName);
    }
  }

  return (
    <Grid className={classes.gameContainer} item>
      <PersonalInfo
        name={userInfo.displayName}
        role={userInfo.role}
        alive={userInfo.alive}
      />
      <Box m={10}>
        <Grid container justify="center" alignItems="center">
            <h2>{deathText}</h2>
            <h3>You may discuss and vote on who to execute</h3>
        </Grid>
        <br />
        {userInfo.role === 1 ? null :
          <Grid container justify="center" alignItems="center" spacing={4}>
            {
              players.map((u) => {
                return (
                  <Player
                    key={u.uid}
                    player={u}
                    handleClick={() => setChoice(u)}
                  />
                );
              })
            }
          </Grid>
        }
        <br /> <br />
        <Grid container justify="center" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            onClick={confirmVote}
          >
            Confirm Vote
          </Button>
        </Grid>
      </Box>
    </Grid>
  );
}

MafiaDay.propTypes = {
  user: PropTypes.object,
  usersData: PropTypes.array,
  usersCollection: PropTypes.object,
  room: PropTypes.object,
  roomData: PropTypes.object,
  mafiaKill: PropTypes.object,
  doctorSave: PropTypes.object,
};
