import React, {useEffect} from 'react';
import Navbar from '../common/Navbar';
import Box from '@material-ui/core/Box';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import DisplayGames from '../search/DisplayGames';
import AllFilters from '../search/AllFilters';
import TopGames from '../home/TopGames';
import {useFirestore} from 'reactfire';

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
  const [paginationCount, setPaginationCount] = React.useState(1);
  const ref = useFirestore().collection('games');
  const [initialize, setInitialize] = React.useState(false);
  const [sortBy, setSortBy] = React.useState('rating');

  useEffect(() => {
    if (initialize === false) {
      let list = [];
      ref.orderBy(sortBy, 'desc').limit(12)
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
        <Typography
          variant='h5'
        >
          Top-Rated Games
        </Typography>
        <br />
        <TopGames games={games} />
      </Box>
    </div>
  );
}
