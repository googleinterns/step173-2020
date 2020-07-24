import React, { useState } from 'react';
import AllReviews from '../Reviews/AllReviews';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import { useFirestore, AuthCheck } from 'reactfire';
import Navbar from '../common/Navbar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Timer from '@material-ui/icons/Timer';
import Star from '@material-ui/icons/Star';
import People from '@material-ui/icons/People';


const useStyles = makeStyles((theme) => ({
    roomJoin: {
        marginTop: theme.spacing(1),
    },
}));

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

    const classes = useStyles();

    return (
        <div>
            <Navbar/>
            <Box container="true" justify="center" alignItems="center" m={10}>
                <Description />
                <Spacer />
                <Grid container spacing={5}>
                    <Grid item>
                        <Typography variant="h4">
                            Play
                        </Typography>
                    </Grid>
                </Grid>
                <br />
                <AuthCheck>
                    <Grid container spacing={3}>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={createRoom}>Create Room</Button>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">
                                OR
                            </Typography>
                        </Grid>
                        <Grid item className={classes.roomJoin}>
                            <input 
                                value={roomId} 
                                onChange={(e) => { setRoomId(e.target.value) }} 
                                type="text"
                            />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={joinRoom} m={5}>Join Room</Button>
                        </Grid>
                    </Grid>
                </AuthCheck>
                <Spacer />
                <Rules />
                <Spacer />
                <AllReviews />
            </Box>          
        </div>
    )
}

function Spacer() {
    return (
        <div>
            <br /> <br />
            <Divider />
            <br /> <br />
        </div>
    );
}

function Description(props) {
    return (
        <Grid container spacing={5}>
            <Grid item>
                <Card>
                    <CardActionArea >
                        <CardMedia
                            component="img"
                            image="https://www.kroger.com/product/images/large/front/0063050951263"
                            title="Contemplative Reptile"
                        />
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item>
                <Container>
                    <Typography variant="h2">
                        Monopoly
                    </Typography>
                    <br />
                    <Typography variant="body1">
                        Buy properties, trade for sets, build houses, and run everyone else out of the game.
                    </Typography>
                    <br />
                    <Typography variant="body2" color="textSecondary" component="p">
                        <IconButton aria-label="share">
                            <Star /> 8/10
                        </IconButton>
                        <IconButton aria-label="share">
                            <Timer /> 1h-2h
                        </IconButton>
                        <IconButton aria-label="share">
                            <People /> 2-5
                        </IconButton>
                    </Typography>
                </Container>
            </Grid>
        </Grid>
    );
}

function Rules(props) {
    return (
        <Grid container>
            <Grid item>
                <Typography variant="h4">
                    Rules
                </Typography>
                <br />
                <Typography variant="body1">
                    get money, buy property, ruin friendships
                </Typography>
            </Grid>
        </Grid>
    );
}
