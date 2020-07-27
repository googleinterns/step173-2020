import React from 'react';
import Slide from '@material-ui/core/Slide';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  rules: {
    background: 'white',
    borderRadius: '5%',
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
      <div className={classes.rules}>
        {rules}
      </div>
    </Slide>
  );
}

RulesDrawer.propTypes = {
  open: PropTypes.bool,
  rules: PropTypes.string,
};
