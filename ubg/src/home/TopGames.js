import React, {useEffect} from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import GameCard from '../search/GameCard';

const useStyles = makeStyles((theme) => ({
  pagination: {
    '& > *': {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
  },
}));

export default function TopGames({games}) {
  const classes = useStyles();
  
  return (
    <Box>
      <Grid container justify="flex-start" alignItems="stretch" spacing={4}>
        {games.map((item) =>
          <Grid key={item['id']} item xs={12} sm={6} xl={2} lg={3} md={4}>
            <GameCard id={item['id']}
              image={item['image']}
              name={item['Name']}
              year={item['year']}
              minTime={item['minPlaytime']}
              maxTime={item['maxPlaytime']}
              minPlayer={item['minPlayer']}
              maxPlayer={item['maxPlayer']}
              rating={item['rating']}
              minAge={item['minAge']}
              weight={item['weight']} />
          </Grid>,
        )}
      </Grid>
    </Box>
  );
}