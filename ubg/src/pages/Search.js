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
  let value = '';
  let display = 'none';
  const location = useLocation();
  if (location.state) {
    value = location.state.value;
    display = location.state.display;
  }
  

  return (
    <div>
      <Navbar />
      <AllFilters setPaginationCount={setPaginationCount} setGames={setGames} value={value} display={display}/>
      <DisplayGames games = {games} paginationCount = {paginationCount} />
    </div>
  );
}
