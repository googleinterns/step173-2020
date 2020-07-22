import React from 'react';

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
        event.target.elements.text.value = "";
        event.target.elements.rating.value = "";
      }      

    render() {
        return(
            <div>
                <form onSubmit={this.addReview}>
                    <h3>Reviews </h3>
                    <br />
                    <label>Rating: </label>
                    <select name='rating'>
                        <option value=''></option>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                    </select>
                    <br />
                    <textarea className='textarea' name='text' placeholder='Add a review'></textarea>
                    <br />
                    <button className='button is-primary'>Submit</button>
                </form>
            </div>
        );
    }
}

export default NewReview;