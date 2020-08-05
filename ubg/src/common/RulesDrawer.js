import React from 'react';
import Slide from '@material-ui/core/Slide';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  rules: {
    borderTop: '1px solid black',
    textAlign: 'left',
  },
}));

/**
 * @param {boolean} open Declares if the drawer is open
 * @param {string} rules Descripton of the rules
 * @return {ReactElement} Drawer with rules description
 */
export default function RulesDrawer({open, rules}) {
  const classes = useStyles();

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Paper className={classes.rules}>
        {rules}
      </Paper>
    </Slide>
  );
}

RulesDrawer.propTypes = {
  open: PropTypes.bool,
  rules: PropTypes.string,
};
