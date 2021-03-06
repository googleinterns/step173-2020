import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import GameCard from './GameCard';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  pagination: {
    '& > *': {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
  },
  fonts: {
    fontWeight: 'bold',
  },
}));

/**
 * @param {object} page current pagination page
 * @param {number} setPage
 * @param {object} games all the games that satisfy filter condition
 * @param {number} paginationCount number of page
 * @param {number} totalGames number of games in total
 * @return {ReactElement} Display all the games that satisfy conditions
 */
export default function DisplayGames({page, setPage, games,
  paginationCount, totalGames, title=null}) {
  const classes = useStyles();
  let total = totalGames;
  if (games.length < 1 || games === undefined) {
    total = 0;
  }

  return (
    <Box m={10}>
      {
        title ?
        <div>
          <Typography variant='h4' className={classes.fonts}>
            {title}
          </Typography>
          <br />
        </div> :
        null
      }
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
        page={page}
        count={paginationCount}
        boundaryCount={2}
        onChange={(e, p) => setPage(p)}
        className={classes.pagination}
      />
    </Box>
  );
}

DisplayGames.propTypes = {
  page: PropTypes.number,
  setPage: PropTypes.func,
  games: PropTypes.array,
  paginationCount: PropTypes.number,
  totalGames: PropTypes.number,
  title: PropTypes.string,
};
