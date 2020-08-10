import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import RulesDrawer from './RulesDrawer';
import IconButton from '@material-ui/core/IconButton';
import UpIcon from '@material-ui/icons/ExpandLess';
import DownIcon from '@material-ui/icons/ExpandMore';
import MafiaGame from '../mafia/MafiaGame';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

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
function GameRoom({gameRules, gameId, room}) {
  const [openRules, setOpenRules] = useState(false);
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <div className={classes.game}>
        {/* Check if gamId is mafia
        (not sure if 925 id mafia) */}
        { gameId === '925' ?
          <MafiaGame room={room} /> :
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
  gameId: PropTypes.string,
  room: PropTypes.object,
};

const mapStateToProps = state => ({
  gameId: state.roomData.gameId,
});

export default connect(
  mapStateToProps,
  {},
)(GameRoom);
