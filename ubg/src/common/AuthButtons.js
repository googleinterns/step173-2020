import firebase from 'firebase/app';
import React from 'react';
import {AuthCheck, useAuth, useUser} from 'reactfire';
import Button from '@material-ui/core/Button';

export default function AuthButtons() {
  const auth = useAuth();
  const user = useUser();
  async function signIn() {
    await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  };
  async function signOut() {
    await auth.signOut();
  };
  return (
    <AuthCheck
      fallback={
        <Button color="inherit" onClick={signIn}>
          Sign In
        </Button>
      }
    >
      <p>{user ? user.displayName : ''}</p>
      <Button color="inherit" onClick={signOut}>
        Sign Out
      </Button>
    </AuthCheck>
  );
}
