import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
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
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu">
          <MenuIcon />
        </IconButton>
        <div className={classes.titleButton}>
          <Button color="inherit" onClick={homePage}>
            <Typography variant="h6">
              UltimateBoardGame
            </Typography>
          </Button>
        </div>
        <Button color='inherit' onClick={searchGames}>
          Search Games
        </Button>
        <SearchField />
        <AuthButtons />
      </Toolbar>
    </AppBar>
  );
}
