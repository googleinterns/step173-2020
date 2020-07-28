import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Navbar from '../common/Navbar';
import GameCard from './GameCard';
import Filter from './Filter';
import {useFirestore} from 'reactfire';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    marginTop: theme.spacing(1.5),
    marginRight: theme.spacing(3),
    float: 'right',
  },
}));

let initialize = false;

/**
 * @return {ReactElement} Search page with filter and search result
 */
export default function Home() {
  const classes = useStyles();
  const ref = useFirestore().collection('games');
  const [minAge, setMinAge] = React.useState(21);
  const [minPlayer, setMinPlayer] = React.useState(1);
  const [maxPlayer, setMaxPlayer] = React.useState('8+');
  const [minTime, setMinTime] = React.useState(5);
  const [maxTime, setMaxTime] = React.useState('240+');
  const [games, setGames] = React.useState([]);
  const handleFilter = () => {
    const newGames = [];
    let maxP = maxPlayer;
    if (typeof maxP === 'string') {
      maxP = Number.MAX_SAFE_INTEGER;
    }
    let maxT = maxTime;
    if (typeof maxT === 'string') {
      maxT = Number.MAX_SAFE_INTEGER;
    }
    if (minPlayer > maxP) {
      setMaxPlayer(minPlayer);
      maxP = minPlayer;
    }
    if (minTime > maxT) {
      setMaxTime(minTime);
      maxT = minTime;
    }
    ref.orderBy('rating', 'desc')
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if (doc.data()['minPlayer'] <= maxP &&
            minPlayer <= doc.data()['maxPlayer'] &&
            doc.data()['minPlaytime'] <= maxT &&
            minTime <= doc.data()['maxPlaytime'] &&
            doc.data()['minAge'] <= minAge) {
              newGames.push(doc.data());
            }
          });
          setGames(newGames);
        })
        .catch(function(error) {
          console.log('Error getting documents: ', error);
        });
  };
  useEffect(() => {
    // using a hack to make useEffect act as onLoad()
    if (initialize === false) {
    // console.log("4");
      const newGames = [];
      ref.orderBy('rating', 'desc')
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              newGames.push(doc.data());
            });
            setGames(newGames);
            initialize = true;
          })
          .catch(function(error) {
            console.log('Error getting documents: ', error);
          });
    }
  }, [ref]);

  return (
    <div>
      <Navbar/>
      <Box boxShadow={1} m={10}>
        <Filter label = "Minimum Age" value={minAge} menu={[8, 10, 14, 16, 21]}
          onChange={(v) => setMinAge(v)} />
        <Filter label = "Minimum Player" value={minPlayer}
          menu={[1, 2, 3, 4, 5, 6, 7, 8]}
          onChange={(v) => setMinPlayer(v)}/>
        <Filter label = "Maximum Player" value={maxPlayer}
          menu={[1, 2, 3, 4, 5, 6, 7, '8+']}
          onChange={(v) => setMaxPlayer(v)} />
        <Filter label = "Minimum Time" value={minTime}
          menu={[5, 15, 30, 60, 90, 120]}
          append={'min'} onChange={(v) => setMinTime(v)} />
        <Filter label = "Maximum Time" value={maxTime}
          menu={[15, 30, 60, 90, 120, '240+']}
          append={'min'} onChange={(v) => setMaxTime(v)} />
        <Button className={classes.button} variant="contained"
          onClick={() => handleFilter()}>Search</Button>
      </Box>
      <Box ml={10}>
        <Grid container justify="flex-start" alignItems="center" spacing={4}>
          {games.map((item) =>
            <Grid key={item['id']} item>
              <GameCard id={item['id']} image={item['image']}
                name={item['Name']} year={item['year']}
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
      </Box>
    </div>
  );
}

