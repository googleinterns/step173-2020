import React from 'react';
import {Box, Button, InputLabel, TextField} from '@material-ui/core/';
import Rating from '@material-ui/lab/Rating';
import PropTypes from 'prop-types';
import {useFirestore, useFirestoreDocData} from 'reactfire';

/**
 * Displays a review writing section
 * @param {l} props
 * @return {ReactElement} Box containing section to write a new review
 */
export default function NewReview(props) {
  const gameName = useFirestoreDocData(
      useFirestore().collection('games').doc(props.gameId)).Name;
  const addReview = (event) => {
    event.preventDefault();
    // Get the values of the form
    const name = props.user.displayName;
    const rating = event.target.elements.rating.value;
    const text = event.target.elements.text.value.trim();
    const timestamp = Date.now();
    const userId = props.user.uid;
    const reviewObject = {name, rating, text, timestamp, userId, gameName};

    // force user to select a rating before submitting review
    if (rating && rating !== null) {
      props.handleAddReview(reviewObject);
    } else {
      alert('You must rate the game');
    }

    // Clear input fields
    event.target.elements.text.value = '';
    event.target.elements.rating.defaultValue = '0';
  };

  return (
    <div>
      <br />
      <Box>
        <form onSubmit={addReview}>
          <Box component="div" mb={3} borderColor="transparent">
            <InputLabel name="reviewText" label="Rating: " />
            <Rating name="rating" defaultValue={0} max={10} />
          </Box>
          <TextField
            id="outlined-multiline-static"
            label="Write a Review"
            name='text'
            multiline
            rows={5}
            fullWidth={true}
            variant="outlined"
          />
          <br />
          <br />
          <Button variant="contained" color="primary" type="submit" disabled={props.reviewed}>
            Submit</Button>
        </form>
      </Box>
    </div>
  );
}

NewReview.propTypes = {
  user: PropTypes.object,
  handleAddReview: PropTypes.func,
  gameId: PropTypes.string,
  reviewed: PropTypes.bool,
};
