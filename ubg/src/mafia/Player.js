import React from 'react';
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
 * @param {string} name name of player
 * @return {ReactElement} Card with different names to choose
 */
export default function Player({name}) {
  const classes = useStyles();
  return (
    <Grid item xs={12} sm={6} xl={2} lg={3} md={4}>
      <Card className={classes.card} >
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

Player.propTypes = {
  name: PropTypes.string,
};
