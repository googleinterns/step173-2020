import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
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
  },
}));

/**
 * @return {ReactElement} Mafia game element
 */
function MafiaGame({day, room, usersCollection, usersData, win, userUid}) {
  const [alert, setAlert] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState('');
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
        end: true,
      });
    // all villagers are dead or one mafia and one villager alive
    } else if (villagerCount === 0 ||
      (mafiaCount === 1 && villagerCount === 1)) {
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
      <div>
        <h1 className={classes.night}>{day ? 'DAY' : 'NIGHT'}</h1>
        <PersonalInfo
          name={userInfo.displayName}
          role={userInfo.role}
          alive={userInfo.alive}
        />
      </div>
      {
        // victory conditions not met
        win === 0 ?
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
        /> :
        // victory conditions met
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
    </div>
  );
}

MafiaGame.propTypes = {
  day: PropTypes.bool,
  room: PropTypes.object,
  usersCollection: PropTypes.object,
  usersData: PropTypes.array,
  win: PropTypes.number,
  userUid: PropTypes.string,
};

const mapStateToProps = (state) => ({
  userUid: state.currentUser.uid,
  day: state.roomData.day,
  usersData: state.usersData,
  win: state.roomData.win,
});

export default connect(
    mapStateToProps,
    {},
)(MafiaGame);
