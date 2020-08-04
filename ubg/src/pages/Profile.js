import React from 'react';
import {useUser, useFirestoreDocData, useFirestore} from 'reactfire';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Navbar from '../common/Navbar';
import GameCard from '../search/GameCard';
//import Reviews from '../reviews/Reviews';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  fonts: {
    fontWeight: 'bold',
  },
  pagination: {
    '& > *': {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
  },
}));

/**
 * @return {ReactElement} Displays profile page
 */
export default function Profile() {
  const user = useUser();
  const classes = useStyles();
  const userCollection = useFirestore().collection('users');
  // const userReviews = useFirestoreDocData(
  //   useFirestore().collection('users').doc(user.uid)).reviews;

  return (
    <div>
      <Navbar />
      <Box container='true' justify='center' alignItems='center' m={10}>
        <Typography variant='h4' className={classes.fonts}>
          {user ? user.displayName : 'Sign in to view your profile'}
        </Typography>
        <br />
        {user ? (
          <div>
            <FavoriteGames userCollection={userCollection} uid={user.uid} />
            {/* <Box>
              <hr />
              <Typography variant='h6'>
                Reviews
              </Typography>
              <br />
              <Grid container justify="flex-start" alignItems="stretch" spacing={4}>
                <Reviews reviews={userReviews} />
              </Grid>
            </Box> */}
          </div>
        ) : ''}
      </Box>
    </div>
  );
}

function FavoriteGames({userCollection, uid}) {
  //const classes = useStyles();
  let userGames = useFirestoreDocData(userCollection.doc(uid)).games;

  return (
    <Box>
      <hr />
      <Typography variant='h6'>
        Favorite Games
      </Typography>
      <br />
      <Grid container justify="flex-start" alignItems="stretch" spacing={4}>
        {userGames.map((game) => {
          return (
            <Grid item key={game.id} xs={12} sm={6} xl={2} lg={3} md={4}>
              <GameCard
                id={game.id}
                image={game.image}
                name={game.name}
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
          );
        })}
      </Grid>
      <br />
    </Box>
  );
}
