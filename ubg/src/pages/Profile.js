import React, {useEffect} from 'react';
import {useUser, useFirestoreDocData, useFirestore} from 'reactfire';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Navbar from '../common/Navbar';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import DisplayGames from '../search/DisplayGames';

const useStyles = makeStyles((theme) => ({
  fonts: {
    fontWeight: 'bold',
  },
  pagination: {
    '& > *': {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
  },
}));

/**
 * @return {ReactElement} Displays profile page
 */
export default function Profile() {
  const user = useUser();
  const classes = useStyles();
  const userCollection = useFirestore().collection('users');

  return (
    <div>
      <Navbar />
      <Box container='true' justify='center' alignItems='center' m={10}>
        <Typography variant='h2' className={classes.fonts}>
          {user ? user.displayName : 'Sign in to view your profile'}
        </Typography>
        <hr />
        {user ? (
          <div>
            <FavoriteGames userCollection={userCollection} uid={user.uid} />
          </div>
        ) : ''}
      </Box>
    </div>
  );
}

/**
 * @param {object} userCollection User collection
 * @param {number} uid ID of current user
 * @return {ReactElement} Grid containing favorite games of current user
 */
function FavoriteGames({userCollection, uid}) {
  const userGames = useFirestoreDocData(userCollection.doc(uid)).games;
  const [paginationCount, setPaginationCount] = React.useState(1);
  const [totalGames, setTotalGames] = React.useState(0);
  const [games, setGames] = React.useState([[]]);

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
    })
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
