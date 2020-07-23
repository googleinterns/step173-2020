import React from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';

const useStyles = makeStyles(theme => ({
  fonts: {
    fontWeight: "bold"
  },
}));

// Returns one formatted review
const Review = props => {
  const classes = useStyles();
  const ratingVal = parseInt(props.review.rating, 10);
  console.log({ratingVal});

  return (
    <div>
        <ListItem key={props.review.name} alignItems="flex-start">
          <ListItemText
          primary={
              <Typography className={classes.fonts} component={'span'}>
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
  
  export default Review;
