import React, {useRef, useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
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
import PropTypes from 'prop-types';
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
  },
  gameName: {
    'white-space': 'nowrap',
    'overflow': 'hidden',
    'text-overflow': 'ellipsis',
  },
}));

/**
 * @param {number} id game unique id
 * @param {string} image iamge link of game
 * @param {string} name game name
 * @param {number} minTime minimum time required
 * @param {number} maxTime maximum time
 * @param {number} minPlayer minimum player
 * @param {number} maxPlayer maximum player
 * @param {number} rating game rating out of 10
 * @param {number} minAge minimum age to play game
 * @param {number} weight difficulty of game out of 10
 * @return {ReactElement} GameCard with basic information of game
 */
export default function GameCard({id, image, name, minTime, maxTime,
  minPlayer, maxPlayer, rating, minAge, weight}) {
  const classes = useStyles();
  rating = rating.toFixed(2);
  weight = weight.toFixed(2);
  const history = useHistory();

  /**
   * Go to game page
   */
  function goToDetails() {
    history.push(`/${id}`);
  }

  const ref = useRef(null);
  const [height, setHeight] = useState(100);
  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.offsetWidth * 1.2);
    }
    const handleResize = () => {
      if (ref.current) {
        setHeight(ref.current.offsetWidth * 1.2);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return (
    <Card className={classes.card} ref={ref} onClick={goToDetails}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height={height}
          image={image}
          title="Random Image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2"
            className={classes.gameName}>
            {name}
          </Typography>
          <Grid container alignItems="center" >
            <Grid item xs={5}>
              <Star /> {rating}/10
            </Grid>
            <Grid item xs={3}>
              <Face /> {minAge}+
            </Grid>
            <Grid item xs={4}>
              <People />
              {minPlayer !== maxPlayer ? <span>{minPlayer}-</span> : null }
              {maxPlayer}
            </Grid>
            <br />
            <Grid item xs={6}><Timer />
              {minTime !== maxTime ? <span>{minTime}-</span> : null }
              {maxTime}min
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

GameCard.propTypes = {
  id: PropTypes.number,
  image: PropTypes.string,
  name: PropTypes.string,
  minTime: PropTypes.number,
  maxTime: PropTypes.number,
  minPlayer: PropTypes.number,
  maxPlayer: PropTypes.number,
  rating: PropTypes.number,
  minAge: PropTypes.number,
  weight: PropTypes.number,
};
