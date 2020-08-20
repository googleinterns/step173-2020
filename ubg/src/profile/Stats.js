import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// import {useFirestoreDocData, useFirestore} from 'reactfire';
// import Stat from './Stat';

export default function Stats({userStats}) {
  const useStyles = makeStyles((theme) => ({
    fonts: {
      fontWeight: 'bold',
    },
    card: {
      width: '100%',
    },
  }));
  const classes = useStyles();

  return (
    <div>
      {
        userStats.map((stat) => {
          return (
            <Card container className={classes.card}>
              {/* <CardMedia
                component="img"
                alt="Contemplative Reptile"
                height='0'
                image={gameDoc.image}
                title="Random Image"
              /> */}
              <CardContent>
                <Typography className={classes.fonts} variant="h5">
                  {stat.gameName}
                </Typography>
                <br />
                Wins: {stat.wins}
                <br />
                Losses: {stat.losses}
              </CardContent>
            </Card>
            // <Stat stat={stat} />
          );
        })
      }
    </div>
  );
}
