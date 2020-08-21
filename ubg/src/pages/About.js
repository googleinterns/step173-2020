import React from 'react';
import Navbar from '../common/Navbar';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';

const useStyles = makeStyles((theme) => ({
  // main: {
  //   height: '100vh',
  //   display: 'flex',
  //   flexDirection: 'column',
  // },
  // container: {
  //   flexGrow: 1,
  //   display: 'flex',
  //   flexDirection: 'column',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // warning: {
  //   width: '20vw',
  //   height: 'auto',
  // },
}));

/**
 * @return {ReactElement} Not found page
 */
export default function About() {
  const classes = useStyles();

  return (
    <div>
      <Navbar />
      <div className={classes.container}>
        aliowehrfoalehflauehflaueh
      </div>
    </div>
  );
}
