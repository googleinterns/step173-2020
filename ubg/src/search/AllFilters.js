import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Filter from './Filter';
import {useFirestore} from 'reactfire';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';

const useStyles = chipDisplay => makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  box: {
    'height': '115px',
  },
  button: {
    marginRight: theme.spacing(3),
    float: 'right',
  },
  gameChip: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(3),
    float: 'right',
  },
  chip: {
    margin: theme.spacing(1.3),
    display: chipDisplay,
  },
  pagination: {
    '& > *': {
      margin: theme.spacing(2),
    },
  },
}));

/**
 * Check whether game name match search input
 */
const checkMatch = (values, name) => {
  for (let i = 0; i < values.length; i++) {
    if (name.toLowerCase().includes(values[i].toLowerCase())) {
      return true;
    }
  }
  return false;
}

/**
 * @param {object} setPaginationCount function to set pagination
 * @param {object} setGames function to set games
 * @param {object} value value entered in SearchField
 * @param {object} chipDisplay display property of Chip
 * @param {object} initialize load all data from database
 * @param {object} setInitialize function to load data
 * @param {object} totalGames number of total games
 * @param {object} setTotalGames function for setting toal games
 * @param {object} clear reset all the filters
 * @param {object} setClear function to reset filters
 * @return {ReactElement} All Filters and related buttons
 */
export default function AllFilters({setPaginationCount, setGames, value, chipDisplay, 
  initialize, setInitialize, totalGames, setTotalGames, clear, setClear}) {
  const classes = useStyles(chipDisplay)();
  const ref = useFirestore().collection('games');
  const [minAge, setMinAge] = React.useState(21);
  const [minPlayer, setMinPlayer] = React.useState(1);
  const [maxPlayer, setMaxPlayer] = React.useState('8+');
  const [minTime, setMinTime] = React.useState(5);
  const [maxTime, setMaxTime] = React.useState('240+');
  const [sortBy, setSortBy] = React.useState('rating');
  /**
   * Get games that satisfy filter conditions
   */
  const handleFilter = () => {
    setInitialize(false);
  };
  /**
   * Reset all the filters
   */
  const handleClear = () => {
    setInitialize(false);
    setClear(true);
  };
  /**
   * Load the games data according to filter
   */
  useEffect(() => {
    // using a hack to load data when needed
    if (initialize === false) {
      if (clear === true) {
        setClear(false);
        setMinAge(21);
        setMinPlayer(1);
        setMaxPlayer('8+');
        setMinTime(5);
        setMaxTime('240+');
      }
      console.log('234');
      setInitialize(true);
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
      const values = value.trim().split(/ +/);
      let total = 0;
      ref.orderBy(sortBy, 'desc')
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              if (doc.data()['minPlayer'] <= maxP &&
              minPlayer <= doc.data()['maxPlayer'] &&
              doc.data()['minPlaytime'] <= maxT &&
              minTime <= doc.data()['maxPlaytime'] &&
              doc.data()['minAge'] <= minAge) {
                if (value === '' || chipDisplay === 'none'){
                  list.push(doc.data());
                  total += 1;
                  if (list.length === 12) {
                    newGames.push(list);
                    list = [];
                  }
                } else if (checkMatch(values, doc.data()['Name'])) {
                  list.push(doc.data());
                  total += 1
                  if (list.length === 12) {
                    newGames.push(list);
                    list = [];
                  }
                }
              }
            });
            if (list.length !== 0) {
              newGames.push(list);
            }
            setGames(newGames);
            setTotalGames(total);
            setPaginationCount(newGames.length);
          })
          .catch(function(error) {
            console.log('Error getting documents: ', error);
          });
    }
  }, [ref, sortBy, setGames, setPaginationCount, initialize, chipDisplay, 
  value, setInitialize, totalGames, setTotalGames,maxPlayer,
  maxTime, minAge, minPlayer, minTime, setClear, clear]);

  return (
    <Box boxShadow={1} m={10} className={classes.box}>
      <Filter
        label = "Minimum Age"
        value={minAge}
        menu={[8, 10, 12, 14, 16, 21]}
        onChange={(v) => setMinAge(v)}
      />
      <Filter
        label = "Minimum Player"
        value={minPlayer}
        menu={[1, 2, 3, 4, 5, 6, 7, 8]}
        onChange={(v) => setMinPlayer(v)}
      />
      <Filter
        label = "Maximum Player"
        value={maxPlayer}
        menu={[1, 2, 3, 4, 5, 6, 7, '8+']}
        onChange={(v) => setMaxPlayer(v)}
      />
      <Filter
        label = "Minimum Time"
        value={minTime}
        menu={[5, 15, 30, 60, 90, 120]}
        append={'min'}
        onChange={(v) => setMinTime(v)}
      />
      <Filter
        label = "Maximum Time"
        value={maxTime}
        menu={[15, 30, 60, 90, 120, '240+']}
        append={'min'}
        onChange={(v) => setMaxTime(v)}
      />
      <Filter
        label = "Sort By"
        value={sortBy}
        menu={['rating', 'weight']}
        onChange={(v) => setSortBy(v)}
      />
      <Chip label={totalGames+' Games'} className={classes.gameChip} display="block"/>
      <br />
      <Chip label={'Search result for: ' + value} className={classes.chip} display="block"/>
      <Button
        className={classes.button}
        variant="contained"
        onClick={() => handleClear()}>
        Clear All Filters
      </Button>
      <Button
        className={classes.button}
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
  value: PropTypes.string,
  chipDisplay: PropTypes.string,
  initialize: PropTypes.bool,
  setInitialize: PropTypes.func,
  totalGames: PropTypes.number,
  setTotalGames: PropTypes.func,
  clear: PropTypes.bool,
  setClear: PropTypes.func,
};
