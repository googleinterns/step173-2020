import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import GameCard from './GameCard';

const useStyles = makeStyles((theme) => ({
  pagination: {
    '& > *': {
      margin: theme.spacing(2),
    },
  },
}));

/**
 * @param {object} games all the games that satisfy filter condition
 * @param {number} paginationCount number of page
 * @return {ReactElement} Display results of all the games that satisfy filter conditions
 */
export default function DisplayGames({games, paginationCount}) {
  const classes = useStyles();
  const [page, setPage] = React.useState(1);
  return (
    <Box m={10}>
      <Grid container justify="flex-start" alignItems="stretch" spacing={4}>
         {games[page-1].map((item) =>
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
      <div className={classes.pagination}>
        <Pagination count={paginationCount} boundaryCount={2} onChange={(e, p) => setPage(p)} />
      </div>
    </Box>
  );
}

DisplayGames.propTypes = {
  games: PropTypes.array,
  paginationCount: PropTypes.number,
};

  