import React from 'react';
import Box from '@material-ui/core/Box';
import Reviews from './Reviews';
import Typography from '@material-ui/core/Typography';
import AuthReview from './AuthReview';
//import { useDatabase } from 'reactfire';

// function AllReviews(props) {
//     //const reviewsRef = useDatabase().ref('reviews');

//     const state = {
//         reviews: {},
//         user: '',
//     }

//     const handleAddReview = (review) => {
//         console.log(review);
//         const reviews = {
//             ...state.reviews
//         }
//         reviews[`rev-${review.timestamp}`] = review;  // create a key with timestamp
//         state.reviews = reviews;
//         console.log(state.reviews);
//         //reviewsRef.push(review);
//     }

//     return (
//         <div className='reviews'>
//             <Box container="true" justify="center" alignItems="center" m={10}>
//                 <Typography variant="h3">
//                     Reviews
//                 </Typography>
//                 <NewReview name={state.user} handleAddReview={handleAddReview} />
//                 <Reviews reviews={state.reviews} />
//             </Box>
//         </div>
//     );
// }

class AllReviews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reviews: {},  // contains all reviews
        };
        this.handleAddReview = this.handleAddReview.bind(this);
    }

    handleAddReview = (review) => {
        const reviews = {
            ...this.state.reviews
        }
        reviews[`rev-${review.timestamp}`] = review;  // create a key with timestamp
        this.setState({
            reviews: reviews
        });
    }

    render() {
        return (
            <div className='reviews'>
                <Box container="true" justify="center" alignItems="center" m={10}>
                    <Typography variant="h3">
                        Reviews
                    </Typography>
                    <AuthReview gameId={this.props.gameId} handleAddReview={this.handleAddReview}/>
                    <Reviews reviews={this.state.reviews} />
                </Box>
            </div>
        );
    }
}

export default AllReviews;
