import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import Button from '@material-ui/core/Button';
import Navbar from '../common/Navbar';
import GameCard from '../search/GameCard';
import Filter from '../search/Filter';
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
  pagination: {
    '& > *': {
      margin: theme.spacing(2),
    },
  },
}));

/**
 * @return {ReactElement} Search page with filter and search result
 */
export default function Search() {
  const classes = useStyles();
  const ref = useFirestore().collection('games');
  const [minAge, setMinAge] = React.useState(21);
  const [minPlayer, setMinPlayer] = React.useState(1);
  const [maxPlayer, setMaxPlayer] = React.useState('8+');
  const [minTime, setMinTime] = React.useState(5);
  const [maxTime, setMaxTime] = React.useState('240+');
  const [games, setGames] = React.useState([[]]);
  const [paginationCount, setPaginationCount] = React.useState(1);
  const [initialize, setInitialize] = React.useState(false);
  const handleFilter = () => {
    const newGames = [];
    var list = []
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
              list.push(doc.data());
              if (list.length === 12){
                newGames.push(list);
                list = [];
              }
            }
          });
          if (list.length !== 0){
            newGames.push(list);
          }
          setGames(newGames);
          setPaginationCount(newGames.length);
        })
        .catch(function(error) {
          console.log('Error getting documents: ', error);
        });
  };
  useEffect(() => {
    // using a hack to make useEffect act as onLoad()
    if (initialize === false) {
      const newGames = [];
      var list = []
      ref.orderBy('rating', 'desc')
          .get()
          .then(function(querySnapshot) {
            setInitialize(true);
            querySnapshot.forEach(function(doc) {
              list.push(doc.data());
              if (list.length === 12){
                newGames.push(list);
                list = [];
              }
            });
            if (list.length !== 0){
              newGames.push(list);
            }
            setGames(newGames);
            setPaginationCount(newGames.length);
            setInitialize(true);
          })
          .catch(function(error) {
            console.log('Error getting documents: ', error);
          });
    }
  }, [ref, initialize]);

  return (
    <div>
      <Navbar/>
      <Box boxShadow={1} m={10}>
        <Filter label = "Minimum Age"
          value={minAge}
          menu={[8, 10, 14, 16, 21]}
          onChange={(v) => setMinAge(v)} />
        <Filter label = "Minimum Player"
          value={minPlayer}
          menu={[1, 2, 3, 4, 5, 6, 7, 8]}
          onChange={(v) => setMinPlayer(v)}/>
        <Filter label = "Maximum Player"
          value={maxPlayer}
          menu={[1, 2, 3, 4, 5, 6, 7, '8+']}
          onChange={(v) => setMaxPlayer(v)} />
        <Filter label = "Minimum Time"
          value={minTime}
          menu={[5, 15, 30, 60, 90, 120]}
          append={'min'}
          onChange={(v) => setMinTime(v)} />
        <Filter label = "Maximum Time"
          value={maxTime}
          menu={[15, 30, 60, 90, 120, '240+']}
          append={'min'}
          onChange={(v) => setMaxTime(v)} />
        <Button className={classes.button}
          variant="contained"
          onClick={() => handleFilter()}>
          Search
        </Button>
      </Box>
      <DisplayGames games = {games} paginationCount = {paginationCount} />
    </div>
  );
}

function DisplayGames({games, paginationCount}) {
  const classes = useStyles();
  const [page, setPage] = React.useState(1);
  return (
    <Box ml={10}>
        <Grid container justify="flex-start" alignItems="center" spacing={4}>
          {games[page-1].map((item) =>
            <Grid key={item['id']} item xl={2} lg={3} md={4} sm={6} xs={12}>
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
        <div className={classes.pagination}>
          <Pagination count={paginationCount} boundaryCount={2} onChange={(e, p) => setPage(p)} />
        </div>
      </Box>
  );
}

