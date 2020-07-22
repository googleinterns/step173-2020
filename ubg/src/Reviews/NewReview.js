import React from 'react';
import { Box, Button, InputLabel, TextField } from '@material-ui/core/';
import Rating from '@material-ui/lab/Rating';

class NewReview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: '',
            text: '',
        };
        this.addReview = this.addReview.bind(this);
    }

    addReview(event) {
        event.preventDefault();
        // Get the values of the form
        const name = this.props.name;
        const text = event.target.elements.text.value.trim();
        const rating = event.target.elements.rating.value;
      
        const reviewObject = { name, text, rating };

        // force user to select a rating before submitting review
        if (rating && rating !== null) {
            this.props.handleAddReview(reviewObject);
        } else {
            alert('You must rate the game');
        }
      
        // Clear input fields
        event.target.elements.text.value = '';
        event.target.elements.rating.defaultValue = '0';
    }

    render() {
        return(
            <div>
                <br />
                <Box>
                    <form onSubmit={this.addReview}>
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
                        <Button variant="contained" color="primary" type="submit">Submit</Button>
                    </form>
                </Box>
            </div>
        );
    }
}

export default NewReview;