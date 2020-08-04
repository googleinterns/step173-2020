import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import GameCard from './GameCard';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  pagination: {
    '& > *': {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
  },
}));

/**
 * @param {object} games all the games that satisfy filter condition
 * @param {number} paginationCount number of page
 * @param {number} totalGames number of games in total
 * @return {ReactElement} Display all the games that satisfy conditions
 */
export default function DisplayGames({games, paginationCount, totalGames}) {
  const classes = useStyles();
  const [page, setPage] = React.useState(1);
  let total = totalGames;
  if (games.length < 1 || games === undefined) {
    total = 0;
  }
  return (
    <Box m={10}>
      <Grid container justify="flex-start" alignItems="stretch" spacing={4}>
        {total === 0 ? null : games[page-1].map((item) =>
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
      <Pagination
        count={paginationCount}
        boundaryCount={2}
        onChange={(e, p) => setPage(p)}
        className={classes.pagination}
      />
    </Box>
  );
}

DisplayGames.propTypes = {
  games: PropTypes.array,
  paginationCount: PropTypes.number,
  totalGames: PropTypes.number,
};
