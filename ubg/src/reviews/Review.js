import React from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  fonts: {
    fontWeight: 'bold',
  },
}));

/**
 * @param {object} review text of the message
 * @return {ReactElement} Returns one formatted review
 */
export default function Review({review}) {
  const classes = useStyles();
  const ratingVal = parseInt(review.rating, 10);

  return (
    <div>
      <ListItem 
        alignItems="flex-start">
        <ListItemText
          primary={
            <Typography
              className={classes.fonts}
              variant="h6"
              component={'span'}
            >
              {review.name}
            </Typography>
          }
          secondary={
            <>
              <Rating
                name="read-only"
                value={ratingVal}
                max={10}
                readOnly
              />
              <br />
              <Typography component={'span'}>
                {review.text}
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider />
    </div>
  );
};

Review.propTypes = {
  review: PropTypes.object,
};

