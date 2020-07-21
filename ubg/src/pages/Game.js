import React from 'react'
import { useParams } from 'react-router-dom';
import AllReviews from '../Reviews/AllReviews';

export default function Game(props) {

    const { gameId } = useParams();

    return (
        <div>
            Game {gameId}
            <AllReviews />
        </div>
    )
}
