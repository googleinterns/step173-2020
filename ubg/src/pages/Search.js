import React from 'react';
import Navbar from '../common/Navbar';
import DisplayGames from '../search/DisplayGames';
import AllFilters from '../search/AllFilters';

/**
 * @return {ReactElement} Search page with filter and search result
 */
export default function Search() {
  const [games, setGames] = React.useState([[]]);
  const [paginationCount, setPaginationCount] = React.useState(1);

  return (
    <div>
      <Navbar />
      <AllFilters setPaginationCount={setPaginationCount} setGames={setGames} />
      <DisplayGames games = {games} paginationCount = {paginationCount} />
    </div>
  );
}
