import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
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
function Player({player, setChoice, choice, user=null, userUid}) {
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
  let roleName = 'villager';
  if (player.role === 2) {
    roleName = 'mafia';
  } else if (player.role === 3) {
    roleName = 'detective';
  } else if (player.role === 4) {
    roleName = 'doctor';
  } else if(player.role === 5) {
    roleName = 'hunter';
  }

  useEffect(changeBorder, [choice]);
  const classes = useStyles(border)();
  return (
    <Grid item xs={12} sm={6} xl={2} lg={3} md={4}>
      <Card className={classes.card}>
        <CardActionArea onClick={() => setChoice(player)}>
          <CardMedia
            component="img"
            alt="unknown role"
            image={userUid !== player.uid ?
              (
                player.role === 2 && user.role === 2 ?
                require('./images/mafia.png') :
                require('./images/unknown.png')
              ) :
              require('./images/' + roleName + '.png')}
            title="unknown role"
          />
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
  userUid: PropTypes.string,
  player: PropTypes.object,
  setChoice: PropTypes.func,
  choice: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  userUid: state.currentUser.uid,
});

export default connect(
    mapStateToProps,
    {},
)(Player);
