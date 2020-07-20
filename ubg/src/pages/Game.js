import React from 'react'
import { useParams } from 'react-router-dom';

export default function Game(props) {

    const { gameId } = useParams();

    return (
        <div>
            Game {gameId}
        </div>
    )
}
