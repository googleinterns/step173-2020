import React, {useEffect} from 'react';
import Navbar from '../common/Navbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {useFirestore} from 'reactfire';
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
  const [topRated, setTopRated] = React.useState([]);
  const [fantasy, setFantasy] = React.useState([]);
  const [economic, setEconomic] = React.useState([]);
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
    const topRatedArr = [];setInitialize(true);
    ref.orderBy(sortBy, 'desc').limit(12)
        .get()
        .then((querySnapshot) => {
          
          querySnapshot.forEach((doc) => {
            topRatedArr.push(doc.data());
          });
          // setGames(gameArr);
          setTopRated(topRatedArr);
        })
        .catch(function(error) {
          console.log('Error getting documents: ', error);
        });
    const beginnerArr = [];
    ref.orderBy('weight').limit(12)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            beginnerArr.push(doc.data());
          });
          setBeginner(beginnerArr);
        })
        .catch(function(error) {
          console.log('Error getting documents: ', error);
        });
    const fantasyArr = [];
    const economicArr = [];
    const cardGameArr = [];
    ref.orderBy('rating')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.data()['categories'].includes('Fantasy') && fantasyArr.length < 6) {
              fantasyArr.push(doc.data());
            }
            if (doc.data()['categories'].includes('Economic') && economicArr.length < 6) {
              economicArr.push(doc.data());
            }
            if (doc.data()['categories'].includes('Card Game') && cardGameArr.length < 6) {
              cardGameArr.push(doc.data());
            }
            
          });
          setFantasy(fantasyArr);
          setEconomic(economicArr);
          setCardGame(cardGameArr);
        })
        .catch(function(error) {
          console.log('Error getting documents: ', error);
        });
  }
}
useEffect(loadData, [initialize]);

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
      <GameCategory category={'Top Rated'} games={topRated}/>
      <GameCategory category={'For Beginners'} games={beginner}/>
      <GameCategory category={'Fantasy'} games={fantasy}/>
      <GameCategory category={'Card Game'} games={cardGame}/>
      <GameCategory category={'Economic'} games={economic}/>
    </div>
  );
}
