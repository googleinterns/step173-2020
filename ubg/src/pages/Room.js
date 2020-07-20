import React from 'react'
import { useParams } from 'react-router-dom';

export default function Room() {

    const { gameId, roomId } = useParams();

    return (
        <div>
            Room {roomId} for game {gameId}
        </div>
    )
}
