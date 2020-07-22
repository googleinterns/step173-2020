import React from 'react';
import {
  Box,
  ListItem,
  Divider,
  ListItemText,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Rating from '@material-ui/lab/Rating';

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  fonts: {
    fontWeight: "bold"
  },
  inline: {
    display: "inline"
  }
}));

// Returns one formatted review
const Review = props => {
  const classes = useStyles();
  const value = parseInt(props.review.rating, 10);
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
                {/* <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  {props.review.rating}
                </Typography> */}
                <Rating name="read-only" value={parseInt(props.review.rating, 10)} readOnly />
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
