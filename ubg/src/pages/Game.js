import React, { useState } from 'react';
import AllReviews from '../Reviews/AllReviews';
import { useParams, useHistory } from 'react-router-dom';
import { useFirestore, AuthCheck } from 'reactfire';
import Navbar from '../common/Navbar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';

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
            <Box container="true" justify="center" alignItems="center" m={10}>
                <Container maxWidth="sm">
                    <Grid container spacing={5}>
                        <Grid item>
                            <CardMedia
                                component="img"
                                image="https://cf.geekdo-images.com/itemrep/img/weqPptR3b4rQSTRLFOWQqsu6EOU=/fit-in/246x300/pic5241325.png"
                                title="Contemplative Reptile"
                            />
                        </Grid>
                        <Grid item>
                            <Typography variant="h2">
                                Monopoly
                            </Typography>
                            <Typography variant="body1">
                                This is a description of the game.
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
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
                <br />
                <br />
                <AllReviews />
            </Box>          
        </div>
    )
}
