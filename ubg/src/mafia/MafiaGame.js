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
function MafiaGame({day, room, usersCollection}) {
  const [alert, setAlert] = React.useState(null);
  /**
   * @param {string} message message to display
   * @return {undefined}
   */
  function showResult(message) {
    setAlert(<AlertDialog message={message}></AlertDialog>);
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
        /> :
        <MafiaNight
          room={room}
          showResult={showResult}
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
});

export default connect(
    mapStateToProps,
    {},
)(MafiaGame);
