import React from 'react';
import Navbar from '../common/Navbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  box: {
    justify: 'center',
    alignItems: 'center'
  },
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
}));

/**
 * @return {ReactElement} Home page which is also landing page
 */
export default function Home() {
  const classes = useStyles();

  return (
    <div>
      <Navbar/>
      <Box
        className={classes.box}
        container='true'
        m={10}
      >
        <Typography
          className={classes.header}
          variant='h1'
        >
          Welcome to UltimateBoardGame!
        </Typography>
      </Box>
    </div>
  );
}
