import React from 'react';
import Navbar from '../common/Navbar';
import DisplayGames from '../search/DisplayGames';
import AllFilters from '../search/AllFilters';
import { useLocation } from "react-router-dom";

/**
 * @return {ReactElement} Search page with filter and search result
 */
export default function Search() {
  const [games, setGames] = React.useState([[]]);
  const [paginationCount, setPaginationCount] = React.useState(1);
  const [chipDisplay, setChipDisplay] = React.useState('none');
  const [value, setValue] = React.useState('');
  const [initialize, setInitialize] = React.useState(false);
  const [search, setSearch] = React.useState(false);
  const [totalGames, setTotalGames] = React.useState(0);
  // let display = 'none';
  const location = useLocation();
  if (location.state && search === true) {
    setValue(location.state.value);
    setChipDisplay(location.state.display);
    setSearch(false);
    setInitialize(false);
  }
  

  return (
    <div>
      <Navbar setSearch={setSearch}/>
      <AllFilters setPaginationCount={setPaginationCount} setGames={setGames}
      value={value} chipDisplay={chipDisplay} setChipDisplay={setChipDisplay}
      initialize={initialize} setInitialize={setInitialize}
      totalGames={totalGames} setTotalGames={setTotalGames}/>
      <DisplayGames games = {games} paginationCount = {paginationCount} totalGames={totalGames}/>
    </div>
  );
}
