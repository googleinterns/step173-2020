import React, { useState } from 'react';
import AllReviews from '../Reviews/AllReviews';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import { useFirestore, AuthCheck, useFirestoreDocData } from 'reactfire';
import Navbar from '../common/Navbar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
//import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import Timer from '@material-ui/icons/Timer';
import Star from '@material-ui/icons/Star';
import People from '@material-ui/icons/People';


const useStyles = makeStyles((theme) => ({
    fonts: {
        fontWeight: "bold"
    },
    roomJoin: {
        marginTop: theme.spacing(1),
    },
    image: {
        display: "block",
        margin: "auto"
    },
    description: {
        alignContent: "center",
        alignItems: "center"
    }
}));

export default function Game() {

    const { gameId } = useParams();
    const history = useHistory();
    const [roomId, setRoomId] = useState('');

    const roomsCollection = useFirestore().collection('rooms');
    const games = useFirestoreDocData(useFirestore().collection('games').doc(gameId));

    async function createRoom() {
        const newRoom = await roomsCollection.doc();
        newRoom.set({ gameId });
        history.push(`/gameRoom/${newRoom.id}`);
    }

    function joinRoom() {
        history.push(`/gameRoom/${roomId}`);
    }

    const classes = useStyles();
    console.log(games);
    if (games.exists) {
        return <p>Not a valid game!</p>
    }

    return (
        <div>
            <Navbar joinRoom={joinRoom} roomId={roomId} setRoomId={setRoomId}/>
            <Box container="true" justify="center" alignItems="center" m={10}>
                <Description games={games} createRoom={createRoom} />
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
    const classes = useStyles();
    let description = 'Game is not available'
    if (props.games.description !== undefined) {
        description = props.games.description.replace(/&#10;&#10;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&ndash;/g, '-')
        .replace(/&#10;/g, ' ')
        .replace(/&amp;/g, ' ')
        .replace(/&mdash;/g, '-');
    }
    let playTime = props.games.minPlaytime + '-' + props.games.maxPlaytime;
    if (props.games.minPlaytime === props.games.maxPlaytime) {
        playTime = props.games.minPlaytime;
    }
    return (
        <Grid container spacing={5} className={classes.description}>
            <Grid item className={classes.description}>
                <Card>
                    <CardMedia
                        component="img"
                        image={props.games.thumbnail}
                        title={props.games.Name}
                        className={classes.image}
                    />
                </Card>
            </Grid>
            <Grid item xs={10} className={classes.description}>
                <Typography variant="h2" className={classes.fonts}>
                    {props.games.Name}
                </Typography>
                <br />
                <Typography variant="body1">
                    {description}
                </Typography>
                <br />
                <Typography variant="body2" color="textSecondary" component="p">
                    <Icon aria-label="share">
                        <Star />{Math.round(props.games.rating)}/10
                    </Icon>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Icon aria-label="share">
                        <Timer />{playTime}
                    </Icon>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Icon aria-label="share">
                        <People />{props.games.minPlayer}-{props.games.maxPlayer}
                    </Icon>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <AuthCheck>
                        <Button variant="contained" color="primary" onClick={props.createRoom}>Create Room</Button>
                    </AuthCheck>
                </Typography>
            </Grid>
        </Grid>
    );
}

function Rules(props) {
    return (
        <div>
            <Grid container>
                <Grid item>
                    <Typography variant="h4">
                        Rules
                    </Typography>
                </Grid>
            </Grid>
            <br />
            <Grid item>
                <Typography variant="body1">
                    {props.rules}
                </Typography>
            </Grid>
        </div>
    );
}
