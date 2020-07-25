import React from 'react';
import Review from './Review';
import List from '@material-ui/core/List';

export default class Reviews extends React.Component {

    renderReview(review) {
        return <Review review={review} />;
    }

    render() {
        return (
            // iterate through all reviews
            <div>
                <List width="100%">
                    {this.props.reviews.map(review => {
                        return this.renderReview(review);
                    })}
                </List>
            </div>
        );
    }
}
