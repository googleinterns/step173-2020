import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Filter from './Filter';
import {useFirestore} from 'reactfire';
import PropTypes from 'prop-types';

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
 * @param {object} setPaginationCount function to set pagination
 * @param {object} setGames function to set games
 * @return {ReactElement} All Filters and related buttons
 */
export default function AllFilters({setPaginationCount, setGames}) {
  const classes = useStyles();
  const ref = useFirestore().collection('games');
  const [minAge, setMinAge] = React.useState(21);
  const [minPlayer, setMinPlayer] = React.useState(1);
  const [maxPlayer, setMaxPlayer] = React.useState('8+');
  const [minTime, setMinTime] = React.useState(5);
  const [maxTime, setMaxTime] = React.useState('240+');
  const [sortBy, setSortBy] = React.useState('rating');
  const [initialize, setInitialize] = React.useState(false);
  const handleFilter = () => {
    const newGames = [];
    let list = [];
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
    ref.orderBy(sortBy, 'desc')
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if (doc.data()['minPlayer'] <= maxP &&
            minPlayer <= doc.data()['maxPlayer'] &&
            doc.data()['minPlaytime'] <= maxT &&
            minTime <= doc.data()['maxPlaytime'] &&
            doc.data()['minAge'] <= minAge) {
              list.push(doc.data());
              if (list.length === 12) {
                newGames.push(list);
                list = [];
              }
            }
          });
          if (list.length !== 0) {
            newGames.push(list);
          }
          setGames(newGames);
          setPaginationCount(newGames.length);
        })
        .catch(function(error) {
          console.log('Error getting documents: ', error);
        });
  };
  const handleClear = () => {
    setMinAge(21);
    setMinPlayer(1);
    setMaxPlayer('8+');
    setMinTime(5);
    setMaxTime('240+');
    const newGames = [];
    let list = [];
    ref.orderBy(sortBy, 'desc')
        .get()
        .then(function(querySnapshot) {
          setInitialize(true);
          querySnapshot.forEach(function(doc) {
            list.push(doc.data());
            if (list.length === 12) {
              newGames.push(list);
              list = [];
            }
          });
          if (list.length !== 0) {
            newGames.push(list);
          }
          setGames(newGames);
          setPaginationCount(newGames.length);
          setInitialize(true);
        })
        .catch(function(error) {
          console.log('Error getting documents: ', error);
        });
  };
  useEffect(() => {
    // using a hack to make useEffect act as onLoad()
    if (initialize === false) {
      console.log('34');
      const newGames = [];
      let list = [];
      ref.orderBy(sortBy, 'desc')
          .get()
          .then(function(querySnapshot) {
            setInitialize(true);
            querySnapshot.forEach(function(doc) {
              list.push(doc.data());
              if (list.length === 12) {
                newGames.push(list);
                list = [];
              }
            });
            if (list.length !== 0) {
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
  }, [ref, sortBy, setGames, setPaginationCount, initialize]);

  return (
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
      <Filter label = "Sort By"
        value={sortBy}
        menu={['rating', 'weight']}
        onChange={(v) => setSortBy(v)} />
      <Button className={classes.button}
        variant="contained"
        onClick={() => handleClear()}>
        Clear All Filters
      </Button>
      <Button className={classes.button}
        variant="contained"
        onClick={() => handleFilter()}>
        Search
      </Button>
    </Box>
  );
}

AllFilters.propTypes = {
  setPaginationCount: PropTypes.func,
  setGames: PropTypes.func,
};
