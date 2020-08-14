import React from 'react';
import Slide from '@material-ui/core/Slide';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  rules: {
    borderTop: '1px solid black',
    textAlign: 'left',
    whiteSpace: 'pre-line'
  },
}));

/**
 * @param {boolean} open Declares if the drawer is open
 * @param {string} rules Descripton of the rules
 * @return {ReactElement} Drawer with rules description
 */
export default function RulesDrawer({open, rules}) {
  const classes = useStyles();
  /**
   * @return {object} inner HTML 
   */
  function createMarkup() {
    return {__html: rules};
  }

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Paper className={classes.rules}>
      <div
        dangerouslySetInnerHTML={createMarkup()}
      >
      </div>
      </Paper>
    </Slide>
  );
}

RulesDrawer.propTypes = {
  open: PropTypes.bool,
  rules: PropTypes.string,
};
