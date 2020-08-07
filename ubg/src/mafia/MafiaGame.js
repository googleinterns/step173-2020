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
export default function MafiaGame({day}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {
        day ?
        <MafiaDay /> :
        <MafiaNight />
      }
    </div>
  );
}

MafiaGame.propTypes = {
  day: PropTypes.bool,
};
