import React from 'react';
import Box from '@material-ui/core/Box';
import GameCard from '../search/GameCard';
import Carousel from 'react-elastic-carousel';

const breakPoints = [
  {width: 1, itemsToShow: 1},
  {width: 600, itemsToShow: 2},
  {width: 960, itemsToShow: 3},
  {width: 1280, itemsToShow: 4},
  {width: 1920, itemsToShow: 6}
];

/**
 * @return {ReactElement} Home page which is also landing page
 */
export default function GameCategory({category, games}) {
  return (
    <Box m={10} container='true'>
      <h1>{category}</h1>
      <Carousel
          itemPadding={[10, 15]}
          breakPoints={breakPoints}
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