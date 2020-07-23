import firebase from 'firebase/app';
import React from 'react';
import { AuthCheck, useAuth, useUser } from 'reactfire';
import Button from '@material-ui/core/Button';
import NewReview from './NewReview';

export default function AuthReview(props) {
  const auth = useAuth();
  const user = useUser();
  async function signIn () {
    await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  };
  return (
    <AuthCheck
      fallback={
          <div>
            <br />
            <Button variant="contained" color="primary" onClick={signIn}>
                Sign in to leave a review
            </Button>
          </div>
      }
    >
      <NewReview gameId={props.gameId} user={user} handleAddReview={props.handleAddReview} />
    </AuthCheck>
  );
}