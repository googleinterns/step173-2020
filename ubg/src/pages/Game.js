import React from 'react'
import AllReviews from '../Reviews/AllReviews';
import { useParams, useHistory } from 'react-router-dom';
import { useFirestore } from 'reactfire';

export default function Game() {

    const { gameId } = useParams();
    const history = useHistory();

    const roomsCollection = useFirestore().collection('rooms');

    async function createRoom() {
        const newRoom = await roomsCollection.doc();
        newRoom.set({users: []});
        history.push(`/${gameId}/${newRoom.id}`);
    }

    return (
        <div>
            Game {gameId}
            <button onClick={createRoom}>Create Room</button>
            <AllReviews />
        </div>
    )
}
