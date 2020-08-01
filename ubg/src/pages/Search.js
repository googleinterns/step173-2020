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
  const [value, setValue] = React.useState('');
  const [initialize, setInitialize] = React.useState(false);
  const [search, setSearch] = React.useState(true);
  //track total number of games
  const [totalGames, setTotalGames] = React.useState(0);
  //whether clear all the filters
  const [clear, setClear] = React.useState(false);
  const {query} = useParams();
  if (query !== undefined && (search === true || query !== value)) {
    console.log("search %%%%");
      setValue(query);
      setChipDisplay('inline-flex');
      setSearch(false);
      setClear(true);
      setInitialize(false);
  }
  if (query === undefined && value != '') {
    console.log("%%%");
    setValue('');
    setChipDisplay('none');
    setSearch(false);
    setClear(true);
    setInitialize(false);
  }
  

  return (
    <div>
      <Navbar />
      <AllFilters setPaginationCount={setPaginationCount} setGames={setGames}
      value={value} chipDisplay={chipDisplay} setChipDisplay={setChipDisplay}
      initialize={initialize} setInitialize={setInitialize}
      totalGames={totalGames} setTotalGames={setTotalGames}
      setClear={setClear} clear={clear}/>
      <DisplayGames games = {games} paginationCount = {paginationCount} totalGames={totalGames}/>
    </div>
  );
}
