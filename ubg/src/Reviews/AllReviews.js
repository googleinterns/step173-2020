import firebase from 'firebase/app';
import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Reviews from './Reviews';
import Typography from '@material-ui/core/Typography';
import { useFirestore } from 'reactfire';
import NewReview from './NewReview';
import { AuthCheck, useAuth, useUser } from 'reactfire';
import Button from '@material-ui/core/Button';

function AllReviews(props) {
    const reviewsRef = useFirestore()
        .collection('gameReviews')
        .doc(props.gameId)
        .collection('reviews');
    const auth = useAuth();
    const user = useUser();

    async function signIn () {
        await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    };

    const populateReviews = () => {
        const tempReviews = [];
        reviewsRef.get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
              tempReviews.push({
                name: doc.data().name,
                rating: doc.data().rating,
                text: doc.data().text,
                timestamp: doc.data().timestamp,
                userId: doc.data().userId
              });
            });
        });
        return tempReviews;
    }

    const [reviews, setReviews] = useState(populateReviews());

    const handleAddReview = (review) => {
        const tempReviews = reviews;
        tempReviews.push(review);
        setReviews(tempReviews);
        reviewsRef.add(review);
    }

    return (
        <div className='reviews'>
            <Box container="true" justify="center" alignItems="center" m={10}>
                <Typography variant="h3">
                    Reviews
                </Typography>
                <AuthCheck
                    fallback={
                        <div>
                            <br />
                            <Button variant="contained" color="primary" onClick={signIn}>
                                Sign in to leave a review
                            </Button>
                        </div>
                    }
                >
                    <NewReview gameId={props.gameId} user={user} handleAddReview={handleAddReview} />
                </AuthCheck>
                <Reviews reviews={reviews} />
            </Box>
        </div>
    );
}

export default AllReviews;
