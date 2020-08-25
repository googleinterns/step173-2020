import React from 'react';
import Navbar from '../common/Navbar';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';

const useStyles = makeStyles((theme) => ({
  grid: {
    backgroundColor: '#dcdef5',
    marginTop: '1em',
  },
  text: {
    color: '#3f51b5',
  },
}));

/**
 * @return {ReactElement} About page
 */
export default function About() {
  const classes = useStyles();

  return (
    <div>
      <Navbar />
      <Box
        container='true'
        m={10}
      >
        <Typography
          variant='h3'
        >
          About UltimateBoardGame
        </Typography>
        <Typography
          variant='h6'
        >
          UltimateBoardGame is aimed to be an alternative to in-person gathering
          during this quarantine time for everyone. 
        </Typography>
        <Grid container spacing={3}
          className={classes.grid}
          alignItems="center"
          justify="center"
        >
        <Grid item xs={4} className={classes.text}>
          <SearchIcon fontSize="large" />
          <Typography
            variant='h6'
          >
            Find the board game you want to try with ease
          </Typography>
        </Grid>
        <Grid item xs={4} className={classes.text}>
          <InsertEmoticonIcon fontSize="large" />
          <Typography
            variant='h6'
          >
            Have fun and connect with friends and family
          </Typography>
        </Grid>
        <Grid item xs={4} className={classes.text}>
          <SportsEsportsIcon fontSize="large" />
          <Typography
            variant='h6'
          >
            Enjoy mafia in private rooms with video chat
          </Typography>
        </Grid>
      </Grid>
      </Box>
    </div>
  );
}
