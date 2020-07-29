import React, {useState} from 'react';
import {
  useFirestore,
  AuthCheck,
  useUser,
  useFirestoreDocData,
} from 'reactfire';
import Typography from '@material-ui/core/Typography';

export default function Profile() {
  const user = useUser();

  return(
    <Typography variant='h4'>
      {user.displayName}
    </Typography>
  );
}