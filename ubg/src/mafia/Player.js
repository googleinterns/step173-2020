import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const useStyles = (border) => makeStyles((theme) => ({
  card: {
    width: '100%',
    border: border,
  },
}));

/**
 * @param {object} player information of player
 * @param {object} setChoice function when card is clicked
 * @param {object} choice what the player picked
 * @param {object} user current user
 * @param {bool} day current daytime status
 * @return {ReactElement} Card with different names to choose
 */
function Player({player, setChoice, choice, user=null, day}) {
  const [border, setBorder] = useState('none');

  /**
   * @return {undefined}
   */
  function changeBorder() {
    if (choice !== undefined && player.uid === choice.uid) {
      setBorder('2px solid black');
    } else {
      setBorder('none');
    }
  }
  let text = '';
  if (user !== null && user.role === 2) {
    if (player.role === 2) {
      text = 'mafia';
    } else {
      text = 'villager';
    }
  }
  useEffect(changeBorder, [choice]);
  const classes = useStyles(border)();
  return (
    <Grid item xs={12} sm={6} xl={2} lg={3} md={4}>
      <Card className={classes.card}>
        <CardActionArea onClick={() => setChoice(player)}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {player.displayName}
              <Typography color="textSecondary">
                {text}
              </Typography>
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
  choice: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  day: state.roomData.day,
});

export default connect(
    mapStateToProps,
    {},
)(Player);
