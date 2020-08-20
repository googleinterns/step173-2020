import React, {useEffect} from 'react';
import {useFirestoreDocData} from 'reactfire';
import DisplayGames from '../search/DisplayGames';
import PropTypes from 'prop-types';

/**
 * Shows the favorite games for given user
 * @param {object} userCollection Reference to user collection
 * @param {string} uid User ID of current user
 * @return {ReactElement} Favorites games in paginated form
 */
export default function FavoriteGames({userCollection, uid}) {
  const userGames = useFirestoreDocData(userCollection.doc(uid)).games;
  const [paginationCount, setPaginationCount] = React.useState(1);
  const [totalGames, setTotalGames] = React.useState(0);
  const [games, setGames] = React.useState([[]]);

  /**
   * Sets up userGames for pagination
   */
  function initPagination() {
    const newGames = [];
    let list = [];
    let total = 0;

    userGames.forEach((game) => {
      list.push(game);
      total += 1;
      if (list.length === 12) {
        newGames.push(list);
        list = [];
      }
    });
    if (list.length !== 0) {
      newGames.push(list);
    }
    setGames(newGames);
    setTotalGames(total);
    setPaginationCount(newGames.length);
  }

  useEffect(initPagination, []);

  return (
    <div>
      <DisplayGames
        games={games}
        paginationCount={paginationCount}
        totalGames={totalGames}
        title='Favorite Games'
      />
    </div>

  );
}

FavoriteGames.propTypes = {
  userCollection: PropTypes.object,
  uid: PropTypes.string,
};
