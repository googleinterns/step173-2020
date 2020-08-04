import firebase from 'firebase/app';
import React from 'react';
import {AuthCheck, useAuth, useUser, useFirestore} from 'reactfire';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';

/**
 * @return {ReactElement} Profile menu with profile and sign out options
 */
export default function AuthButtons() {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    paper: {
      marginRight: theme.spacing(2),
    },
  }));
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const anchorRef = React.useRef(null);
  const history = useHistory();
  const auth = useAuth();
  const user = useUser();
  const ref = useFirestore()
      .collection('users');
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  /**
   * Brings up a Google sign in popup
   * @return {void}
   */
  async function signIn() {
    await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    const currUser = firebase.auth().currentUser;
    await ref.doc(currUser.uid).get().then((doc) => {
      if (!doc.exists) {
        ref.doc(currUser.uid).set({
          displayName: currUser.displayName,
          games: [],
          reviews: [],
        });
      }
    }).catch(function(error) {
      console.log('Error getting document:', error);
    });
  };

  /**
   * Signs user out and redirects to home page
   * @return {void}
   */
  async function signOut() {
    await auth.signOut();
  };

  /**
   * Redirects to the user's profile page
   * @return {void}
   */
  function toProfile() {
    history.push(`/profile/${user.uid}`);
  };

  return (
    <div className={classes.root}>
      <AuthCheck
        fallback={
          <Button color="inherit" onClick={signIn}>
            Sign In
          </Button>
        }
      >
        <Button
          ref={anchorRef}
          color='inherit'
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <AccountCircleIcon />
          &nbsp;&nbsp;
          {user ? user.displayName : 'guest user'}
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition disablePortal
        >
          {({TransitionProps, placement}) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open} id="menu-list-grow"
                  >
                    <MenuItem onClick={toProfile}>Profile</MenuItem>
                    <MenuItem onClick={signOut}>Sign Out</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </AuthCheck>
    </div>
  );
}
