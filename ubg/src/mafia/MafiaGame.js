import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import MafiaDay from './MafiaDay';
import MafiaNight from './MafiaNight';
import PersonalInfo from './PersonalInfo';
import PropTypes from 'prop-types';
import AlertDialog from './utils/AlertDialog';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';
import {useFirestore, useFirestoreDocData} from 'reactfire';
import ExitDialog from './utils/ExitDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    overflow: 'scroll',
  },
  rootNight: {
    height: '100%',
    width: '100%',
    overflow: 'scroll',
    backgroundColor: 'rgb(150, 150, 150)',
  },
  time: {
    float: 'right',
    marginRight: '4vw',
  },
  personalInfo: {
    marginTop: '1vw',
    marginLeft: '1vw',
  },
}));

/**
 * @return {ReactElement} Mafia game element
 */
function MafiaGame({day, room, usersCollection, usersData, userUid,
  playAgain, leaveRoom}) {
  const classes = useStyles();
  const [alert, setAlert] = useState(null);
  const [exit, setExit] = useState(null);
  const [userInfo, setUserInfo] = useState('');
  const userDoc = useFirestore().collection('users').doc(userUid);
  const userDocData = useFirestoreDocData(userDoc);

  /**
   * @param {string} message message to display
   * @return {undefined}
   */
  function showResult(message) {
    setAlert(<AlertDialog message={message}></AlertDialog>);
  }
  /**
   * Show exit dialog
   * @return {undefined}
   */
  function exitGame() {
    setExit(<ExitDialog leaveRoom={leaveRoom} setExit={setExit}
      endGame={endGame} room={room} role={userInfo.role}/>);
  }
  /**
   * Determines if game has reached end
   * @param {func} resolve Function that will let game proceed
   */
  async function endGame(resolve) {
    setUserInfo(usersData.find((u) => u.uid === userUid));
    const mafiaCount = usersData.filter((u) => u.role === 2 &&
      u.alive).length;
    const villagerCount = usersData.filter((u) => u.role !== 2 &&
      u.alive).length;
    const role = usersData.find((u) => u.uid === userUid).role;

    // all mafia are dead
    if (mafiaCount === 0) {
      await room.update({
        win: 1,
      });
      role === 2 ?
      (
        userDoc.update({
          'mafiaStats.losses': userDocData.mafiaStats.losses + 1,
        })
      ) :
      (
        userDoc.update({
          'mafiaStats.wins': userDocData.mafiaStats.wins + 1,
        })
      );
      playAgain();
    // all villagers are dead or one mafia and one villager alive
    } else if (villagerCount === 0 ||
      (mafiaCount === 1 && villagerCount === 1)) {
      await room.update({
        win: 2,
      });
      role === 2 ?
      (
        userDoc.update({
          'mafiaStats.wins': userDocData.mafiaStats.wins + 1,
        })
      ) :
      (
        userDoc.update({
          'mafiaStats.losses': userDocData.mafiaStats.losses + 1,
        })
      );
      playAgain();
    // continue game
    } else {
      resolve();
    }
  }

  return (
    <div className={day ? classes.root : classes.rootNight}>
      {alert}
      {exit}
      <div className={classes.personalInfo}>
        <h1 className={classes.time}>{day ? 'DAY' : 'NIGHT'}</h1>
        <PersonalInfo
          name={userInfo.displayName}
          role={userInfo.role}
          alive={userInfo.alive}
        />
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={() => exitGame()}
        >
          Leave Game
        </Button>
      </div>
      {
        day ?
        <MafiaDay
          usersCollection={usersCollection}
          room={room}
          endGame={endGame}
        /> :
        <MafiaNight
          usersCollection={usersCollection}
          room={room}
          showResult={showResult}
          endGame={endGame}
        />
      }
    </div>
  );
}

MafiaGame.propTypes = {
  day: PropTypes.bool,
  room: PropTypes.object,
  usersCollection: PropTypes.object,
  usersData: PropTypes.array,
  userUid: PropTypes.string,
  playAgain: PropTypes.func,
  leaveRoom: PropTypes.func,
};

const mapStateToProps = (state) => ({
  userUid: state.currentUser.uid,
  day: state.roomData.day,
  usersData: state.usersData,
});

export default connect(
    mapStateToProps,
    {},
)(MafiaGame);
