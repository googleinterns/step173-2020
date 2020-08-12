import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
  },
}));

/**
 * @param {object} player information of player
 * @param {object} setChoice function when card is clicked
 * @param {object} choice what the player picked
 * @return {ReactElement} Card with different names to choose
 */
export default function Player({player, setChoice, choice}) {
  const [elevation, setElevation] = useState(1);
  /**
   * @return {undefined}
   */
  function changeElevation() {
    if (player.uid === choice.uid) {
      setElevation(5);
    } else {
      setElevation(1);
    }
  }

  useEffect(changeElevation, [choice]);
  const classes = useStyles();
  return (
    <Grid item xs={12} sm={6} xl={2} lg={3} md={4}>
      <Card className={classes.card} elevation={elevation}>
        <CardActionArea onClick={() => setChoice(player)}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {player.displayName}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

Player.propTypes = {
  player: PropTypes.object,
  setChoice: PropTypes.func,
  choice: PropTypes.object,
};
