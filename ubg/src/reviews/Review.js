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

// Returns one formatted review
const Review = (props) => {
  const classes = useStyles();
  const ratingVal = parseInt(props.review.rating, 10);

  return (
    <div>
      <ListItem key={props.review.name + props.review.timestamp}
        alignItems="flex-start">
        <ListItemText
          primary={
            <Typography
              className={classes.fonts}
              variant="h6"
              component={'span'}
            >
              {props.review.name}
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
                {props.review.text}
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

export default Review;
