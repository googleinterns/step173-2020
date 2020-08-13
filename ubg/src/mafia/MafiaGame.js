import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import MafiaDay from './MafiaDay';
import MafiaNight from './MafiaNight';
import PropTypes from 'prop-types';
import AlertDialog from './utils/AlertDialog';
import {connect} from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
  },
}));

/**
 * @return {ReactElement} Mafia game element
 */
function MafiaGame({day, room, usersCollection, usersData}) {
  const [alert, setAlert] = React.useState(null);
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
    const mafiaCount = usersData.filter((u) => u.role === 2 &&
      u.alive).length;
    const villagerCount = usersData.filter((u) => u.role !== 2 &&
      u.alive).length;
    // all mafia are dead
    if (mafiaCount === 0) {
      // setWin(1);
      room.update({
        win: 1,
        end: true,
      });
    // all villagers are dead or one mafia and one villager alive
    } else if (villagerCount === 0 ||
      (mafiaCount === 1 && villagerCount === 1)) {
      // setWin(2);
      room.update({
        win: 2,
        end: true,
      });
    }
  }
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {alert}
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
};

const mapStateToProps = (state) => ({
  day: state.roomData.day,
  usersData: state.usersData,
  end: state.roomData.end,
  win: state.roomData.win,
});

export default connect(
    mapStateToProps,
    {},
)(MafiaGame);
