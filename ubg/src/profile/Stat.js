import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {useFirestoreDocData, useFirestore} from 'reactfire';

export default function Stat({stat}) {
  const useStyles = makeStyles((theme) => ({
    fonts: {
      fontWeight: 'bold',
    },
  }));
  const gameName = useFirestoreDocData(
    useFirestore()
    .collection('games')
    .doc(stat.gameId.toString())
  ).Name;
  const classes = useStyles();

  return (
    <div>
      <Typography className={classes.fonts} variant="h5">
        {gameName}
      </Typography>
      <br />
      wins: {stat.wins}
      <br />
      losses: {stat.losses}
    </div>
  );
}