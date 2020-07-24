import React from 'react';
import NewReview from './NewReview';
import Box from '@material-ui/core/Box';
import Reviews from './Reviews';
import Typography from '@material-ui/core/Typography';

class AllReviews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reviews: {},  // contains all reviews
            user: 'John Smith',
        };
        this.handleAddReview = this.handleAddReview.bind(this);
    }

    handleAddReview(review) {
        const reviews = {
            ...this.state.reviews
        }
        const timestamp = Date.now();
        reviews[`rev-${timestamp}`] = review;  // create a key with timestamp
        this.setState({
            reviews: reviews
        });
    }

    render() {
        return (
            <div className='reviews'>
                <Box container="true" justify="center" alignItems="center">
                    <Typography variant="h4">
                        Reviews
                    </Typography>
                    <NewReview name={this.state.user} handleAddReview={this.handleAddReview} />
                    <Reviews reviews={this.state.reviews} bggReviews={this.bggReviews} />
                </Box>
            </div>
        );
    }
}

export default AllReviews;
