import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Player from './Player';
import PersonalInfo from './PersonalInfo';
import PropTypes from 'prop-types';
import * as firebase from 'firebase/app';

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
    if (roomData.dayVote.length === usersData.length) {
      // most voted person is executed
      // if tie, show message that says it's a tie
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
  function setVote(player) {
    const prevVote = roomData.dayVote.find(u => u.player === user.uid);
    // if (!voted) {
      // if (roomData.dayVote.some(e => e.player === player.uid)) {
      //   roomData.dayVote.find(user => user.player === player.uid).count += 1;
      //   room.update({
      //     dayVote: roomData.dayVote,
      //   })
      //   console.log(roomData.dayVote);
      // } else {
      //   roomData.dayVote.push({
      //     player: player.uid,
      //     count: 1,
      //   });
      //   room.update({
      //     dayVote: firebase.firestore.FieldValue.arrayUnion(...roomData.dayVote),
      //   });
      // }
      if (prevVote) {
        roomData.dayVote.splice(prevVote, 1);
      }
      roomData.dayVote.push({
        player: (user.uid),
        vote: (player.uid),
      })
      room.update({
        dayVote: roomData.dayVote,
      });
    //   setVoted(true);
    // }
  }

  return (
    <Grid className={classes.gameContainer} item>
      <PersonalInfo
        name={userInfo.displayName}
        role={userInfo.role}
        alive={userInfo.alive}
      />
      <Box m={10}>
        <Box className={classes.text} my={15} justify="center" mx="auto">
          <h2>{deathText}</h2>
        </Box>
        {userInfo.role === 1 ? null :
          <Grid container justify="center" alignItems="center" spacing={4}>
            {
              players.map((u) => {
                return (
                  <Player
                    key={u.uid}
                    player={u}
                    handleClick={setVote}
                  />
                );
              })
            }
          </Grid>
        }
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
