import React, {useState} from 'react';
import AllReviews from '../Reviews/AllReviews';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import { useFirestore, AuthCheck, useUser, useFirestoreDocData } from 'reactfire';
import Navbar from '../common/Navbar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import Timer from '@material-ui/icons/Timer';
import Star from '@material-ui/icons/Star';
import People from '@material-ui/icons/People';
import TextField from '@material-ui/core/TextField';
import ReactPlayer from "react-player";

const useStyles = makeStyles((theme) => ({
    fonts: {
        fontWeight: "bold"
    },
    roomJoin: {
        marginTop: theme.spacing(1),
    },
    image: {

    },
    section: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
}));

/**
 * @return {ReactElement} Game details page
 */
export default function Game() {
    const user = useUser();
    const {gameId} = useParams();
    const history = useHistory();
    const [roomId, setRoomId] = useState('');
    const roomsCollection = useFirestore().collection('rooms');
    const games = useFirestoreDocData(useFirestore().collection('games').doc(gameId));

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

    const classes = useStyles();

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
                            <TextField
                                value={roomId}
                                onChange={(e) => {
                                    setRoomId(e.target.value) 
                                }}
                                type="text"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item className={classes.section}>
                            <Button variant="contained" color="primary" onClick={joinRoom} m={5}>Join Room</Button>
                        </Grid>
                    </Grid>
                </AuthCheck>
                <Spacer />
                <Rules games={games}/>
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
    let playTime = props.games.minPlaytime + '-' + props.games.maxPlaytime;
    let players = props.games.minPlayer + '-' + props.games.maxPlayer;
    if (props.games.description !== undefined) {
        description = props.games.description.replace(/&#10;&#10;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&ndash;/g, '-')
        .replace(/&#10;/g, ' ')
        .replace(/&amp;/g, ' ')
        .replace(/&mdash;/g, '-');
    }
    if (props.games.minPlaytime === props.games.maxPlaytime) {
        playTime = props.games.minPlaytime;
    }
    if (props.games.minPlayer === props.games.maxPlayer) {
        players = props.games.minPlayer;
    }
    return (
        <Grid container spacing={5}>
            <Grid item xs={2} className={classes.section}>
                <Card>
                    <CardMedia
                        component="img"
                        image={props.games.image}
                        title={props.games.Name}
                        className={classes.image}
                    />
                </Card>
            </Grid>
            <Grid item xs={10} className={classes.section}>
                <Grid item>
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
                            <People />{players}
                        </Icon>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <AuthCheck>
                            <Button variant="contained" color="primary" onClick={props.createRoom}>Create Room</Button>
                        </AuthCheck>
                    </Typography>
                </Grid>
                <br />

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
            <Grid container spacing={3}>
                {props.games.videos.slice(0,3).map(video => {
                    return (
                        <Grid item>
                            <ReactPlayer
                                url={video.link} 
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
}
