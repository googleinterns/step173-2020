import React from 'react';
import Review from './Review';

class Reviews extends React.Component {
    renderReview(key, review) {
        return <Review key={key} review={review} />;
    }

    render() {
        return (
            // iterate through all reviews
            <div>
                {Object.keys(this.props.reviews).reverse().map(key =>
                  this.renderReview(key, this.props.reviews[key]))}
            </div>
        );
    }
}

export default Reviews;
