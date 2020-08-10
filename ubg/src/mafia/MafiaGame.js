import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import MafiaDay from './MafiaDay';
import MafiaNight from './MafiaNight';
import PropTypes from 'prop-types';
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
function MafiaGame({day, room}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {
        day ?
        <MafiaDay /> :
        <MafiaNight
          room={room}
        />
      }
    </div>
  );
}

MafiaGame.propTypes = {
  day: PropTypes.bool,
  room: PropTypes.object,
};

const mapStateToProps = state => ({
  day: state.roomData.day,
});

export default connect(
  mapStateToProps,
  {},
)(MafiaGame);