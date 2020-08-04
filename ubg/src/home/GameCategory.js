import React, {useEffect} from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import GameCard from '../search/GameCard';

// const useStyles = makeStyles((theme) => ({
//   box: {
//     justify: 'center',
//   },
//   header: {
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// }));

/**
 * @return {ReactElement} Home page which is also landing page
 */
export default function GameCategory({category, games}) {
  // const classes = useStyles();
  // const [games, setGames] = React.useState([]);
  // const ref = useFirestore().collection('games');
  // const [initialize, setInitialize] = React.useState(false);
  // const [sortBy] = React.useState('rating');

  // useEffect(() => {
  //   if (initialize === false) {
  //     const gameArr = [];
  //     ref.orderBy(sortBy, 'desc').limit(10)
  //         .get()
  //         .then((querySnapshot) => {
  //           setInitialize(true);
  //           querySnapshot.forEach((doc) => {
  //             gameArr.push(doc.data());
  //           });
  //           setGames(gameArr);
  //         })
  //         .catch(function(error) {
  //           console.log('Error getting documents: ', error);
  //         });
  //   }
  // }, [ref, initialize, sortBy, setGames]);
  function loadGameCard(item, index) {
    let display;
    if (index < 3) {
      display = 'block';
    // } else if (index === 2) {
    //   display = { xs: 'none',md: 'none', lg: 'block' };
    } else if (index === 3) {
      display = { xs: 'block' ,md: 'none', lg: 'block' };
    } else if (index < 6) {
      display = { xs: 'none',md: 'none', lg: 'none', xl: 'block' };
    } else {
      display = 'none';
    }
    return <Grid key={item['id']} item xs={12} sm={6} xl={2} lg={3} md={4}>
      <Box display={display}>
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
        weight={item['weight']} /></Box>
    </Grid>
  }

  return (
    <Box m={10}>
      <h1>{category}</h1>
      <Grid container justify="flex-start" alignItems="stretch" spacing={4}>
      {games.map((item, index) => loadGameCard(item, index)
        )}
        </Grid>
    </Box>
    );
  }