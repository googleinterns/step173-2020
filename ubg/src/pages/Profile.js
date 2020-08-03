import React from 'react';
import {useUser, useFirestoreDocData, useFirestore} from 'reactfire';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Navbar from '../common/Navbar';
import GameCard from '../search/GameCard';
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
  const userGames = useFirestoreDocData(
    useFirestore().collection('users').doc(user ? user.uid : '0')).games;

  return (
    <div>
      <Navbar />
      <Box container='true' justify='center' alignItems='center' m={10}>
        <Typography variant='h4' className={classes.fonts}>
          {user ? user.displayName : 'Sign in to view your profile'}
        </Typography>
        <br />
        {user ? (
          <Box>
            <hr />
            <Typography variant='h6'>
              Favorite Games
            </Typography>
            <br />
            <Grid container justify="flex-start" alignItems="stretch" spacing={4}>
              {userGames.map((game) =>
                <Grid item key={game.id} xs={12} sm={6} xl={2} lg={3} md={4}>
                  <GameCard
                    id={game.id}
                    image={game.image}
                    name={game.Name}
                    year={game.year}
                    minTime={game.minPlaytime}
                    maxTime={game.maxPlaytime}
                    minPlayer={game.minPlayer}
                    maxPlayer={game.maxPlayer}
                    rating={game.rating}
                    minAge={game.minAge}
                    weight={game.weight}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        ) : ''}
      </Box>
    </div>
  );
}
