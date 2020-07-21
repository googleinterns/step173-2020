import React from 'react';
import NewReview from './NewReview';
import Reviews from './Reviews';

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
                <NewReview name={this.state.user} handleAddReview={this.handleAddReview}/>
                <Reviews reviews={this.state.reviews}/>
            </div>
        );
    }
}

export default AllReviews;
