import React from 'react';
import Navbar from '../common/Navbar';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';

const useStyles = makeStyles((theme) => ({
  main: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warning: {
    width: '20vw',
    height: 'auto',
  },
}));

/**
 * @return {ReactElement} Not found page
 */
export default function NotFound() {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <Navbar />
      <div className={classes.container}>
        <WarningIcon className={classes.warning} />
        <Typography variant="h3">
          404 Page not found :(
        </Typography>
        <Typography variant="subtitle1">
          Maybe the page you are looking for has been removed,
          or you typed in the wrong URL
        </Typography>
      </div>
    </div>
  );
}
