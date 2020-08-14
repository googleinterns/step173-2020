import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import MafiaDay from './MafiaDay';
import MafiaNight from './MafiaNight';
import PersonalInfo from './PersonalInfo';
import PropTypes from 'prop-types';
import AlertDialog from './utils/AlertDialog';
import {connect} from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    overflow: 'scroll',
  },
  time: {
    float: 'right',
    marginRight: '4vw',
  },
}));

/**
 * @return {ReactElement} Mafia game element
 */
function MafiaGame({day, room, usersCollection, usersData, userUid,
  playAgain}) {
  const classes = useStyles();
  const [alert, setAlert] = useState(null);
  const [userInfo, setUserInfo] = useState('');
  /**
   * @param {string} message message to display
   * @return {undefined}
   */
  function showResult(message) {
    setAlert(<AlertDialog message={message}></AlertDialog>);
  }
  /**
   * Determines if game has reached end
   */
  function endGame() {
    setUserInfo(usersData.find((u) => u.uid === userUid));
    const mafiaCount = usersData.filter((u) => u.role === 2 &&
      u.alive).length;
    const villagerCount = usersData.filter((u) => u.role !== 2 &&
      u.alive).length;
    // all mafia are dead
    if (mafiaCount === 0) {
      room.update({
        win: 1,
      });
      playAgain();
    // all villagers are dead or one mafia and one villager alive
    } else if (villagerCount === 0 ||
      (mafiaCount === 1 && villagerCount === 1)) {
      room.update({
        win: 2,
      });
      playAgain();
    }
  }

  return (
    <div className={classes.root}>
      {alert}
      <div>
        <h1 className={classes.time}>{day ? 'DAY' : 'NIGHT'}</h1>
        <PersonalInfo
          name={userInfo.displayName}
          role={userInfo.role}
          alive={userInfo.alive}
        />
      </div>
      {
        day ?
        <MafiaDay
          usersCollection={usersCollection}
          room={room}
          showResult={showResult}
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
