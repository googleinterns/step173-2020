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
export default function MafiaGame({day, user, usersData, room,
  roomData, mafiaKill, doctorSave, detectiveCheck, usersCollection}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {
        day ?
        <MafiaDay
          mafiaKill={mafiaKill}
          doctorSave={doctorSave}
          usersData={usersData}
          usersCollection={usersCollection}
          user={user}
          room={room}
          roomData={roomData}
        /> :
        <MafiaNight
          user={user}
          usersData={usersData}
          room={room}
          mafiaKill={mafiaKill}
          doctorSave={doctorSave}
          detectiveCheck={detectiveCheck}
        />
      }
    </div>
  );
}

MafiaGame.propTypes = {
  day: PropTypes.bool,
  user: PropTypes.object,
  usersData: PropTypes.array,
  room: PropTypes.object,
  mafiaKill: PropTypes.object,
  doctorSave: PropTypes.object,
  detectiveCheck: PropTypes.object,
};
