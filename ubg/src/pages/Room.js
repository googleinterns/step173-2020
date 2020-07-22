import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import firebase from 'firebase';

export default function Room() {

    const [user, setUser] = useState("Daniel")
    const { gameId, roomId } = useParams();
    const room = useFirestore().collection('rooms').doc(roomId);
    const roomData = useFirestoreDocData(room);
    const fieldValue = firebase.firestore.FieldValue;

    function joinRoom(){
        room.update({users: fieldValue.arrayUnion(user)})
    }

    return (
        <div>
            Room {roomId} for game {gameId}
            <br />
            {roomData.users.map(user => {
                return (<p>{user}</p>)
            })}
            <br />
            <input type="text" value={user} onChange={(e) => { setUser(e.target.value) }} />
            <button onClick={joinRoom}>Join</button>
        </div>
    )
}
