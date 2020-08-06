import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: 260,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 121,
  },
}));

/**
 * @param {string} name name of player
 * @param {string} role role of player
 * @param {boolean} alive alive or dead
 * @return {ReactElement} Card with infomation of player's role
 */
export default function PersonalInfo({name, role, alive}) {
  const classes = useStyles();
  let state = 'alive';
  if (alive === false) {
    state = 'dead';
  }

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Role: {role}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {state}
          </Typography>
        </CardContent>
      </div>
      <CardMedia
        className={classes.cover}
        component="img"
        alt="Random Image"
        title="Random Image"
      />
    </Card>
  );
}

PersonalInfo.propTypes = {
  name: PropTypes.string,
  role: PropTypes.string,
  alive: PropTypes.bool,
};