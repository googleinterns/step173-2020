import React from 'react';
import Navbar from '../common/Navbar';
import DisplayGames from '../search/DisplayGames';
import AllFilters from '../search/AllFilters';
import {useParams} from "react-router-dom";

/**
 * @return {ReactElement} Search page with filter and search result
 */
export default function Search() {
  const [games, setGames] = React.useState([[]]);
  const [paginationCount, setPaginationCount] = React.useState(1);
  const [chipDisplay, setChipDisplay] = React.useState('none');
  const [initialize, setInitialize] = React.useState(false);
  //track total number of games
  const [totalGames, setTotalGames] = React.useState(0);
  //whether reset all the filters
  const [clear, setClear] = React.useState(false);
  //value of what's been entered in SearchField
  const [value, setValue] = React.useState('');
  const {query} = useParams();

  if (query !== undefined && query !== value) {
    setValue(query);
    setChipDisplay('inline-flex');
    setClear(true);
    setInitialize(false);
  }
  /**
   * the situation where user is on Search page from Search Field and  
   * click on 'SEARCH GAMES' button
   */
  if (query === undefined && value !== '') {
    setValue('');
    setChipDisplay('none');
    setClear(true);
    setInitialize(false);
  }
  

  return (
    <div>
      <Navbar />
      <AllFilters
        setPaginationCount={setPaginationCount}
        setGames={setGames}
        value={value}
        chipDisplay={chipDisplay}
        initialize={initialize}
        setInitialize={setInitialize}
        totalGames={totalGames}
        setTotalGames={setTotalGames}
        clear={clear}
        setClear={setClear}
      />
      <DisplayGames games = {games} paginationCount = {paginationCount} totalGames={totalGames} />
    </div>
  );
}
