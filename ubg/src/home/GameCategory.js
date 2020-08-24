import React from 'react';
import Box from '@material-ui/core/Box';
import GameCard from '../search/GameCard';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import PropTypes from 'prop-types';

const responsive = {
  extremelyLargeDesktop: {
    breakpoint: {max:5000, min: 1921},
    items: 6,
  },
  superLargeDesktop: {
    breakpoint: {max: 1920, min: 1701},
    items: 5,
  },
  LargeDesktop: {
    breakpoint: {max: 1700, min: 1280},
    items: 4,
  },
  desktop: {
    breakpoint: {max: 1280, min: 961},
    items: 3,
  },
  tablet: {
    breakpoint: {max: 960, min: 601},
    items: 2,
  },
  mobile: {
    breakpoint: {max: 600, min: 1},
    items: 1,
  },
};

/**
 * @param {string} category category of games
 * @param {object} games list of games
 * @return {ReactElement} Carousel for displaying games
 */
export default function GameCategory({category, games}) {
  return (
    <Box m={10} container='true'>
      <h1>{category}</h1>
      <Carousel
        responsive={responsive}
        infinite={false}
      >
        {games.map((game) => {
          return (
            <GameCard
              key={game.id}
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
          );
        })}
      </Carousel>
    </Box>
  );
}

GameCategory.propTypes = {
  category: PropTypes.string,
  games: PropTypes.array,
};
