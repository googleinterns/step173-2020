import React, { useState } from 'react';
import AllReviews from '../reviews/AllReviews';
import { useParams, useHistory } from 'react-router-dom';
import { useFirestore, AuthCheck } from 'reactfire';
import Navbar from '../common/Navbar';

export default function Game() {

    const { gameId } = useParams();
    const history = useHistory();
    const [roomId, setRoomId] = useState('');

    const roomsCollection = useFirestore().collection('rooms');

    async function createRoom() {
        const newRoom = await roomsCollection.doc();
        newRoom.set({gameId});
        history.push(`/gameRoom/${newRoom.id}`);
    }

    function joinRoom() {
        history.push(`/gameRoom/${roomId}`);
    }

    return (
        <div>
            <Navbar/>          
            Game {gameId}
            <AuthCheck>
                <br />
                <button onClick={createRoom}>Create Room</button>
                <br />
                <input 
                    value={roomId} 
                    onChange={(e) => { setRoomId(e.target.value) }} 
                    type="text"
                />
                <button onClick={joinRoom}>Join Room</button>
            </AuthCheck>
            <AllReviews gameId={gameId}/>
        </div>
    )
}
