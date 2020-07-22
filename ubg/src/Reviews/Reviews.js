import React from 'react';
import Review from './Review';
import List from '@material-ui/core/List';

class Reviews extends React.Component {

    renderReview(key, review) {
        return <Review key={key} review={review} />;
    }

    render() {
        return (
            // iterate through all reviews
            <div>
                <List width="100%">
                    {Object.keys(this.props.reviews).reverse().map(key =>
                        this.renderReview(key, this.props.reviews[key]))}
                </List>
            </div>
        );
    }
}

export default Reviews;
