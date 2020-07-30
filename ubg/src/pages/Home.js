import React, {useEffect} from 'react';
import Navbar from '../common/Navbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {useFirestore} from 'reactfire';
import GameCard from '../search/GameCard';
import Carousel from 'react-elastic-carousel';

const useStyles = makeStyles((theme) => ({
  box: {
    justify: 'center',
  },
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    padding: '0 30px',
  }
}));

/**
 * @return {ReactElement} Home page which is also landing page
 */
export default function Home() {
  const classes = useStyles();
  const [games, setGames] = React.useState([]);
  const ref = useFirestore().collection('games');
  const [initialize, setInitialize] = React.useState(false);
  const [sortBy] = React.useState('rating');
  const breakPoints = [
    { width: 1200, itemsToShow: 5 },
  ];

  useEffect(() => {
    if (initialize === false) {
      let list = [];
      ref.orderBy(sortBy, 'desc').limit(10)
          .get()
          .then(function(querySnapshot) {
            setInitialize(true);
            querySnapshot.forEach(function(doc) {
              list.push(doc.data());
            })
            setGames(list);
          })
          .catch(function(error) {
            console.log('Error getting documents: ', error);
          });
      
    }
  }, [ref, initialize, sortBy, setGames]);

  return (
    <div>
      <Navbar/>
      <Box
        className={classes.box}
        container='true'
        m={10}
      >
        <Typography
          className={classes.header}
          variant='h1'
        >
          Welcome to UltimateBoardGame!
        </Typography>
      </Box>
      <Box
        className={classes.box}
        container='true'
        m={10}
      >
        <Typography variant='h5'>
          Top-Rated Games
        </Typography>
        <br />
        <Carousel breakPoints={breakPoints}>
          {games.map(game => {
            return (
              <GameCard id={game.id}
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
    </div>
  );
}
