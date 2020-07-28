import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AuthButtons from './AuthButtons';
import SearchField from './SearchField';
import {Link} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  titleButton: {
    flexGrow: 1,
    textDecoration: 'none',
    color: 'white',
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
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit"
          aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Link to="/" className={classes.titleButton}>
          <Typography variant="h6">
            UltimateBoardGame
          </Typography>
        </Link>
        <Link to="/search" className={classes.Button}>
          <Button color="inherit">
            Search Games
          </Button>
        </Link>
        <SearchField />
        <AuthButtons />
      </Toolbar>
    </AppBar>
  );
}
