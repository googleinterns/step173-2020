import React from 'react';
import { Box, Button, InputLabel, TextField } from '@material-ui/core/';
import Rating from '@material-ui/lab/Rating';

function NewReview(props) {
    const addReview = (event) => {
        event.preventDefault();
        
        // Get the values of the form
        //const gameId = props.gameId;
        const name = "Shandy Kim";//props.user.displayName;
        const rating = event.target.elements.rating.value;
        const text = event.target.elements.text.value.trim();
        const timestamp = Date.now();
        const userId = "123";
      
        const reviewObject = { name, rating, text, timestamp, userId };

        // force user to select a rating before submitting review
        if (rating && rating !== null) {
            props.handleAddReview(reviewObject);
        } else {
            alert('You must rate the game');
        }
      
        // Clear input fields
        event.target.elements.text.value = '';
        event.target.elements.rating.defaultValue = '0';
    }

    return(
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
                    <Button variant="contained" color="primary" type="submit">Submit</Button>
                </form>
            </Box>
        </div>
    );
}

// class NewReview extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             rating: '',
//             text: '',
//         };
//         //this.addReview = this.addReview.bind(this);
//     }

//     addReview = (event) => {
//         event.preventDefault();
        
//         // Get the values of the form
//         const gameId = "PQFqXA1V8EK2X8WDMsAV";
//         const name = this.props.name;
//         const rating = event.target.elements.rating.value;
//         const text = event.target.elements.text.value.trim();
//         const timestamp = Date.now();
//         const userId = "P2Q8D9"
      
//         const reviewObject = { gameId, name, rating, text, timestamp, userId };

//         // force user to select a rating before submitting review
//         if (rating && rating !== null) {
//             this.props.handleAddReview(reviewObject);
//         } else {
//             alert('You must rate the game');
//         }
      
//         // Clear input fields
//         event.target.elements.text.value = '';
//         event.target.elements.rating.defaultValue = '0';
//     }

//     render() {
//         return(
//             <div>
//                 <br />
//                 <Box>
//                     <form onSubmit={this.addReview}>
//                         <Box component="div" mb={3} borderColor="transparent">
//                             <InputLabel name="reviewText" label="Rating: " />
//                             <Rating name="rating" defaultValue={0} max={10} />
//                         </Box>
//                         <TextField
//                             id="outlined-multiline-static"
//                             label="Write a Review"
//                             name='text'
//                             multiline
//                             rows={5}
//                             fullWidth={true}
//                             variant="outlined"
//                         />
//                         <br />
//                         <br />
//                         <Button variant="contained" color="primary" type="submit">Submit</Button>
//                     </form>
//                 </Box>
//             </div>
//         );
//     }
// }

export default NewReview;