import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Navbar from '../common/Navbar';
import DisplayGames from '../search/DisplayGames';
import AllFilters from '../search/AllFilters';
import {useParams} from 'react-router-dom';

const useStyles = (searchDisplay) => makeStyles((theme) => ({
  h1: {
    marginLeft: '80px',
    marginBottom: '-59px',
    display: searchDisplay,
  },
}));

/**
 * @return {ReactElement} Search page with filter and search result
 */
export default function Search() {
  const [games, setGames] = React.useState([[]]);
  const [paginationCount, setPaginationCount] = React.useState(1);
  const [searchDisplay, setSearchDisplay] = React.useState('none');
  const classes = useStyles(searchDisplay)();
  const [initialize, setInitialize] = React.useState(false);
  // track total number of games
  const [totalGames, setTotalGames] = React.useState(0);
  // whether reset all the filters
  const [clear, setClear] = React.useState(false);
  // value of what's been entered in SearchField
  const [value, setValue] = React.useState('');
  const {query} = useParams();

  if (query !== undefined && query !== value) {
    setValue(query);
    setSearchDisplay('block');
    setClear(true);
    setInitialize(false);
  }
  /**
   * the situation where user is on Search page from Search Field and
   * click on 'SEARCH GAMES' button
   */
  if (query === undefined && value !== '') {
    setValue('');
    setSearchDisplay('none');
    setClear(true);
    setInitialize(false);
  }

  return (
    <div>
      <Navbar />
      <h1 className={classes.h1}>Search result for: {value}</h1>
      <AllFilters
        setPaginationCount={setPaginationCount}
        setGames={setGames}
        value={value}
        initialize={initialize}
        setInitialize={setInitialize}
        totalGames={totalGames}
        setTotalGames={setTotalGames}
        clear={clear}
        setClear={setClear}
      />
      <DisplayGames
        games={games}
        paginationCount={paginationCount}
        totalGames={totalGames}
      />
    </div>
  );
}
