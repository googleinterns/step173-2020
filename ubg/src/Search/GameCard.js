import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Star from '@material-ui/icons/Star';
import Timer from '@material-ui/icons/Timer';
import People from '@material-ui/icons/People';
import Face from '@material-ui/icons/Face';
import SignalCellular3Bar from '@material-ui/icons/SignalCellular3Bar';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  card: {
    width: 370,
  }
}));

/**
 * @param {json} props relevant information of game
 * @return {ReactElement} GameCard with basic information of game
 */

export default function GameCard(props) {
    const classes = useStyles();
    let name = props.name;
    if (props.name.length > 27) {
      name = name.substring(0, 27) + "...";
    }
    const rating = (props.rating).toFixed(2);
    const weight = (props.weight).toFixed(2);
    return (
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            component="img"
            alt="Contemplative Reptile"
            height="300"
            image={props.image}
            title="Random Image"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {name}  
            </Typography>
              <Grid container alignItems="center" >
                <Grid item xs={5}>
                  <Star /> {rating}/10
                </Grid>
                <Grid item xs={3}>
                  <Face /> {props.minAge}+
                </Grid>
                <Grid item xs={4}>
                  <People /> 
                  {props.minPlayer !== props.maxPlayer ? <span>{props.minPlayer}-</span> : null }
                  {props.maxPlayer}
                </Grid>
                <br />
                <Grid item xs={6}><Timer /> 
                  {props.minTime !== props.maxTime ? <span>{props.minTime}-</span> : null }
                  {props.maxTime}min
                </Grid>
                <Grid item xs={6}>
                  <SignalCellular3Bar /> {weight}/10
                </Grid>
              </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }