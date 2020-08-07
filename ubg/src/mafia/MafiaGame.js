import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import MafiaDay from './MafiaDay';
import MafiaNight from './MafiaNight';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
  },
}));

/**
 * @return {ReactElement} Mafia game element
 */
export default function MafiaGame({day, roomData, user, usersData,
  room, mafiaKill, doctorSave}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {
        day ?
        <MafiaDay /> :
        <MafiaNight
          roomData={roomData}
          user={user}
          usersData={usersData}
          room={room}
          mafiaKill={mafiaKill}
          doctorSave={doctorSave}
        />
      }
    </div>
  );
}

MafiaGame.propTypes = {
  day: PropTypes.bool,
  roomData: PropTypes.object,
  user: PropTypes.object,
  usersData: PropTypes.array,
  room: PropTypes.object,
  mafiaKill: PropTypes.object,
  doctorSave: PropTypes.object,
};
