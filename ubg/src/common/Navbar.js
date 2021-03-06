import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AuthButtons from './ProfileMenu';
import SearchField from './SearchField';
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  titleButton: {
    flexGrow: 1,
    justifyContent: 'left',
    textTransform: 'none',
  },
  Button: {
    textDecoration: 'none',
    color: 'white',
  },
}));

/**
 * @return {ReactElement} Navigation bar of website
 */
export default function Navbar() {
  const classes = useStyles();
  const history = useHistory();

  /**
   * Go to the home page url
   */
  function homePage() {
    history.push('/');
  }
  /**
   * Go to the search games url
   */
  function searchGames() {
    history.push('/search');
  }
  /**
   * Go to the about page
   */
  function about() {
    history.push('/about');
  }
  /**
   * Go to the friends page
   */
  function friends() {
    history.push('/friends');
  }
  return (
    <AppBar position="static">
      <Toolbar>
        <div className={classes.titleButton}>
          <Button color="inherit" onClick={homePage}>
            <Typography variant="h6">
              UltimateBoardGame
            </Typography>
          </Button>
        </div>
        <Button color="inherit" onClick={about}>
          About
        </Button>
        <Button color="inherit" onClick={friends}>
          Friends
        </Button>
        <Button color="inherit" onClick={searchGames}>
          Search Games
        </Button>
        <SearchField />
        <AuthButtons />
      </Toolbar>
    </AppBar>
  );
}
