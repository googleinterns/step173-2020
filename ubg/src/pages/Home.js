import React, {useEffect} from 'react';
import Navbar from '../common/Navbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {useFirestore} from 'reactfire';
import GameCard from '../search/GameCard';
import Carousel from 'react-elastic-carousel';
import GameCategory from '../home/GameCategory';

const useStyles = makeStyles((theme) => ({
  box: {
    justify: 'center',
  },
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
}));

/**
 * @return {ReactElement} Home page which is also landing page
 */
export default function Home() {
  const classes = useStyles();
  const [games, setGames] = React.useState([]);
  const [fantasy, setFantasy] = React.useState([]);
  const [Economic, setEconomic] = React.useState([]);
  const [cardGame, setCardGame] = React.useState([]);
  const [beginner, setBeginner] = React.useState([]);
  const ref = useFirestore().collection('games');
  const [initialize, setInitialize] = React.useState(false);
  const [sortBy] = React.useState('rating');

  /**
 * @return {undefined}
 */
function loadData() {
  if (initialize === false) {
    const gameArr = [];setInitialize(true);
    ref.orderBy(sortBy, 'desc').limit(10)
        .get()
        .then((querySnapshot) => {
          
          querySnapshot.forEach((doc) => {
            gameArr.push(doc.data());
          });
          setGames(gameArr);
        })
        .catch(function(error) {
          console.log('Error getting documents: ', error);
        });
    const beginnerArr = [];
    ref.orderBy('weight').limit(12)
        .get()
        .then((querySnapshot) => {
          // setInitialize(true);
          querySnapshot.forEach((doc) => {
            beginnerArr.push(doc.data());
          });
          setBeginner(beginnerArr);
        })
        .catch(function(error) {
          console.log('Error getting documents: ', error);
        });
    const fantasyArr = [];
    ref.orderBy('rating')
        .get()
        .then((querySnapshot) => {
          // setInitialize(true);
          querySnapshot.forEach((doc) => {
            if (doc.data()['categories'].includes('Fantasy') && fantasyArr.length < 11) {
              fantasyArr.push(doc.data());
            }
            
          });
          setFantasy(fantasyArr);
        })
        .catch(function(error) {
          console.log('Error getting documents: ', error);
        });
  }
}
useEffect(loadData, [initialize]);

  // useEffect(() => {
    // if (initialize === false) {
    //   const gameArr = [];
    //   ref.orderBy(sortBy, 'desc').limit(10)
    //       .get()
    //       .then((querySnapshot) => {
    //         setInitialize(true);
    //         querySnapshot.forEach((doc) => {
    //           gameArr.push(doc.data());
    //         });
    //         setGames(gameArr);
    //       })
    //       .catch(function(error) {
    //         console.log('Error getting documents: ', error);
    //       });
    //   const beginnerArr = [];
    //   ref.orderBy('weight').limit(10)
    //       .get()
    //       .then((querySnapshot) => {
    //         setInitialize(true);
    //         querySnapshot.forEach((doc) => {
    //           beginnerArr.push(doc.data());
    //         });
    //         setGames(beginnerArr);
    //       })
    //       .catch(function(error) {
    //         console.log('Error getting documents: ', error);
    //       });
    //   const fantasyArr = [];
    //   ref.orderBy('rating')
    //       .get()
    //       .then((querySnapshot) => {
    //         setInitialize(true);
    //         querySnapshot.forEach((doc) => {
    //           if (doc.data()['categories'].includes('Fantasy') && fantasyArr.length < 6) {
    //             fantasyArr.push(doc.data());
    //           }
              
    //         });
    //         setGames(fantasyArr);
    //       })
    //       .catch(function(error) {
    //         console.log('Error getting documents: ', error);
    //       });
    // }
  // }, [ref, initialize, sortBy, setGames]);

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
        <Carousel
          itemPadding={[10, 15]}
          itemsToShow={5}
          itemsToScroll={5}
        >
          {games.map((game) => {
            return (
              <GameCard className={classes.card}
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
      <GameCategory category={'For Beginners'} games={beginner}/>
      <GameCategory category={'Fantasy'} games={fantasy}/>
    </div>
  );
}
