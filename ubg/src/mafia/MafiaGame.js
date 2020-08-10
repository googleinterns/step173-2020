import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import MafiaDay from './MafiaDay';
import MafiaNight from './MafiaNight';
import PropTypes from 'prop-types';
import AlertDialog from './utils/AlertDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
  },
}));

/**
 * @return {ReactElement} Mafia game element
 */
export default function MafiaGame({day, user, usersData,
  room, mafiaKill, doctorSave, detectiveCheck}) {
    const [alert, setAlert] = React.useState(null);
  function showResult(message) {
    console.log(message);
    setAlert(<AlertDialog message={message}></AlertDialog>);
  }
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h1>sdfad</h1>
      {alert}
      {
        day ?
        <MafiaDay /> :
        <MafiaNight
          user={user}
          usersData={usersData}
          room={room}
          mafiaKill={mafiaKill}
          doctorSave={doctorSave}
          detectiveCheck={detectiveCheck}
          showResult={showResult}
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
