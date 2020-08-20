import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {useFirestoreDocData, useFirestore} from 'reactfire';

const useStyles = makeStyles((theme) => ({
  fonts: {
    fontWeight: 'bold',
  },
  card: {
    width: '100%',
  },
}));

export default function Stat({stat}) {
  const classes = useStyles();
  const gameDoc =  useFirestoreDocData(
      useFirestore()
      .collection('games')
      .doc(stat.gameId.toString()));

  return (
    <div>
      <Card container className={classes.card}>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height='0'
          image={gameDoc.image}
          title="Random Image"
        />
        <CardContent>
          <Typography className={classes.fonts} variant="h5">
            {gameDoc.Name}
          </Typography>
          <br />
          wins: {stat.wins}
          <br />
          losses: {stat.losses}
        </CardContent>
      </Card>
    </div>
  );
}
