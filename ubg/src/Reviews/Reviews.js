import React from 'react';
import Review from './Review';
import List from '@material-ui/core/List';

class Reviews extends React.Component {

    renderReview(review) {
        return <Review eview={review} />;
    }

    render() {
        if (this.props.review !== undefined) {
            console.log('HELLO!');
            return (
                // iterate through all reviews
                <div>
                    <List width="100%">
                        {this.props.reviews.forEach(review => {
                            this.renderReview(review);
                        })}
                        {/* {Object.keys(this.props.reviews).reverse().map(key =>
                            this.renderReview(key, this.props.reviews[key]))} */}
                    </List>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default Reviews;
