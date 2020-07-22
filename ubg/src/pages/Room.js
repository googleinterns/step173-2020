import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocData, useUser, useFirestoreCollectionData } from 'reactfire';

export default function Room() {

    const [inLobby, setInLobby] = useState(false);
    const {uid, displayName, email} = useUser();
    const { roomId } = useParams();
    const room = useFirestore().collection('rooms').doc(roomId);
    const roomData = useFirestoreDocData(room);
    const usersCollection = room.collection('users');
    const usersData = useFirestoreCollectionData(usersCollection);

    function joinRoom() {
        usersCollection.doc(uid).set({displayName, email});
        setInLobby(true);
    }

    function leaveRoom() {
        usersCollection.doc(uid).delete();
        setInLobby(false);
    }

    return (
        <div>
            Room {roomId} for game {roomData.gameId}
            <br />
            {   
                usersData.map(user => {
                return (<p key={user.email}>{user.displayName}</p>)
                })
            }
            <br />
            { 
                inLobby ? 
                <button onClick={leaveRoom}>Leave Room</button> 
                :
                <button onClick={joinRoom}>Join Room</button>
            }
        </div>
    )
}
