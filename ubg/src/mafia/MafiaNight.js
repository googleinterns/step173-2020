import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Player from './Player';
import PersonalInfo from './PersonalInfo';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
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
 * @return {ReactElement} Mafia night element
 */
function MafiaNight({userUid, usersData, room,
  mafiaKill, doctorSave, detectiveCheck, showResult, mafiaDecision}) {
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
    if (initialize === false) {
      setInitialize(true);
      const roles = new Set();
      const allPlayers = [];
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
    }
    if (mafiaKill &&
      doctorSave &&
      detectiveCheck &&
      mafiaKill.uid !== '' &&
      doctorSave.uid !== '' &&
      detectiveCheck.uid !== '') {
      room.update({day: true});
    }
  }
  /**
   * Check if all mafias decide to kill the same person
   * @return {undefined}
   */
  function mafiaVote() {
    if (mafiaDecision.length !== 0 && mafiaDecision.length === mafiaTotal) {
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
              {text: 'Mafia please vote again', hours, minutes},
            ),
          });
          setChose(false);
          return;
        }
      }
      room.update({
        mafiaKill: mafiaDecision[0].vote,
        mafiaChat: firebase.firestore.FieldValue.arrayUnion(
          {text: mafiaDecision[0].vote.displayName + ' is now dead',
          hours, minutes},
        ),
      });
    }
  }
  /**
   * Load the all the mafia related data
   */
  useEffect(loadNightData, [mafiaKill, doctorSave, detectiveCheck]);
  useEffect(mafiaVote, [mafiaDecision]);

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
        if (chose === false) {
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
              {text: userInfo.displayName + ' voted for ' + player.displayName,
              hours, minutes},
            ),        
          });
          setChose(true);
          showResult('You have killed ' + player.displayName + ' tonight.');
        } else {
          setMessage('You have already chosen someone to kill.');
        }
        break;
      case 3:
        if (detectiveCheck.uid === '') {
          if (player.role === 2) {
            showResult('This person is bad.');
          } else {
            showResult('This person is good.');
          }
          room.update(
              {detectiveCheck:
              {uid: player.uid, displayName: player.displayName}});
        } else {
          setMessage('You can only check once each night.');
        }
        break;
      case 4:
        if (doctorSave.uid === '') {
          room.update(
              {doctorSave: {uid: player.uid, displayName: player.displayName}});
          showResult('You have saved ' + player.displayName + ' tonight.');
        } else if (room.doctorSave !== player.uid) {
          setMessage('You have already chosen ' +
          doctorSave.displayName + ' to save tonight.');
        }
        break;
      default:
        setMessage('Role is invalid.');
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
        <Box className={classes.text} my={15} justify="center" mx="auto">
          <h2>{roleText}</h2>
          <h2>{message}</h2>
        </Box>
        {userInfo.role === 1 || userInfo.alive === false ? null :
        <div>
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
          <br /> <br />
          <Grid container justify="center" alignItems="center">
            <Button
              variant="contained"
              color="primary"
              onClick={confirmClick}
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
  room: PropTypes.object,
  mafiaKill: PropTypes.object,
  doctorSave: PropTypes.object,
  detectiveCheck: PropTypes.object,
  showResult: PropTypes.func,
  mafiaDecision: PropTypes.array,
};

const mapStateToProps = (state) => ({
  userUid: state.currentUser.uid,
  usersData: state.usersData,
  mafiaKill: state.roomData.mafiaKill,
  doctorSave: state.roomData.doctorSave,
  detectiveCheck: state.roomData.detectiveCheck,
  mafiaDecision: state.roomData.mafiaDecision,
});

export default connect(
    mapStateToProps,
    {},
)(MafiaNight);
