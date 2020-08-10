import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import RulesDrawer from './RulesDrawer';
import IconButton from '@material-ui/core/IconButton';
import UpIcon from '@material-ui/icons/ExpandLess';
import DownIcon from '@material-ui/icons/ExpandMore';
import MafiaGame from '../mafia/MafiaGame';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  main: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  game: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rules: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    textAlign: 'center',
  },
}));

/**
 * @return {ReactElement} Game room element
 */
export default function GameRoom({gameRules, roomData, user,
  usersData, room, mafiaKill, doctorSave, detectiveCheck, usersCollection}) {
  const [openRules, setOpenRules] = useState(false);
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <div className={classes.game}>
        {/* Check if gamId is mafia
        (not sure if 925 id mafia) */}
        { roomData.gameId === '925' ?
          <MafiaGame
            day={roomData.day}
            user={user}
            usersData={usersData}
            usersCollection={usersCollection}
            room={room}
            roomData={roomData}
            mafiaKill={mafiaKill}
            doctorSave={doctorSave}
            detectiveCheck={detectiveCheck}
          /> :
          'no game'
        }
      </div>
      <div className={classes.rules}>
        <IconButton onClick={() => setOpenRules(!openRules)} >
          {openRules ? <DownIcon /> : <UpIcon />}
        </IconButton>
        <RulesDrawer
          open={openRules}
          rules={gameRules}
        />
      </div>
    </div>
  );
}

GameRoom.propTypes = {
  gameRules: PropTypes.string,
  roomData: PropTypes.object,
  user: PropTypes.object,
  usersData: PropTypes.array,
  usersCollection: PropTypes.object,
  room: PropTypes.object,
  mafiaKill: PropTypes.object,
  doctorSave: PropTypes.object,
  detectiveCheck: PropTypes.object,
};
