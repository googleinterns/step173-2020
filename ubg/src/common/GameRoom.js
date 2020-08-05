import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import RulesDrawer from './RulesDrawer';
import IconButton from '@material-ui/core/IconButton';
import UpIcon from '@material-ui/icons/ExpandLess';
import DownIcon from '@material-ui/icons/ExpandMore';

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
export default function Room() {
  const [openRules, setOpenRules] = useState(false);
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <div className={classes.game}>
        Game
      </div>
      <div className={classes.rules}>
        <IconButton onClick={() => setOpenRules(!openRules)} >
          {openRules ? <DownIcon /> : <UpIcon />}
        </IconButton>
        <RulesDrawer
          open={openRules}
          rules="Here is the game description"
        />
      </div>
    </div>
  );
}
