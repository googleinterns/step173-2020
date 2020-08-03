import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
  },
  nameTime: {
    display: 'flex',
    alignItems: 'center',
  },
  name: {
    flexGrow: 1,
  },
}));

/**
 * @param {string} user name of the user who sent the message
 * @param {string} text text of the message
 * @param {string} time time that the message was sent
 * @return {ReactElement} Div with message info
 */
export default function Message({user, text, time}) {
  const classes = useStyles();
  return (
    <div className={classes.main}>
      <div className={classes.nameTime}>
        <Typography
          variant="subtitle2"
          color="primary"
          className={classes.name}
        >{user}</Typography>
        <Typography variant="caption">{time}</Typography>
      </div>
      <Typography variant="body2">{text}</Typography>
      <Divider />
    </div>
  );
}

Message.propTypes = {
  user: PropTypes.string,
  text: PropTypes.string,
  time: PropTypes.string,
};
