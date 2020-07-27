import React, {useState} from 'react';
import AllReviews from '../Reviews/AllReviews';
import {useParams, useHistory} from 'react-router-dom';
import {useFirestore, AuthCheck, useUser} from 'reactfire';
import Navbar from '../common/Navbar';

/**
 * @return {ReactElement} Game details page
 */
export default function Game() {
  const user = useUser();
  const {gameId} = useParams();
  const history = useHistory();
  const [roomId, setRoomId] = useState('');
  const roomsCollection = useFirestore().collection('rooms');

  /**
   * Creates a room in firebase and adds the current user as host
   */
  async function createRoom() {
    const newRoom = await roomsCollection.doc();
    newRoom.set({gameId, host: user.uid});
    history.push(`/gameRoom/${newRoom.id}`);
  }
  /**
   * Go to a rooms url with the room id
   */
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
          onChange={(e) => {
            setRoomId(e.target.value);
          }}
          type="text"
        />
        <button onClick={joinRoom}>Join Room</button>
      </AuthCheck>
      <AllReviews />
    </div>
  );
}
