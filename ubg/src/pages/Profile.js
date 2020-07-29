import React from 'react';
import {useUser} from 'reactfire';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Navbar from '../common/Navbar';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  fonts: {
    fontWeight: 'bold',
  },
}));

/**
 * @return {ReactElement} Displays profile page
 */
export default function Profile() {
  const user = useUser();
  const classes = useStyles();

  return (
    <div>
      <Navbar />
      <Box container='true' justify='center' alignItems='center' m={10}>
        <Typography variant='h4' className={classes.fonts}>
          {user ? user.displayName : 'Sign in to view your profile'}
        </Typography>
      </Box>
    </div>
  );
}
