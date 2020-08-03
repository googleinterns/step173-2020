import React, {useState} from 'react';
import AllReviews from '../reviews/AllReviews';
import {makeStyles} from '@material-ui/core/styles';
import {useParams, useHistory} from 'react-router-dom';
import {
  useFirestore,
  AuthCheck,
  useUser,
  useFirestoreDocData,
} from 'reactfire';
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
import Face from '@material-ui/icons/Face';
import SignalCellular3Bar from '@material-ui/icons/SignalCellular3Bar';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import VideoCard from '../reviews/VideoCard';

const useStyles = makeStyles((theme) => ({
  fonts: {
    fontWeight: 'bold',
  },
  roomJoin: {
    marginTop: theme.spacing(1),
  },
  section: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    '& > *': {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
  },
}));

/**
 * @return {ReactElement} Game details page
 */
export default function Game() {
  const classes = useStyles();
  const user = useUser();
  const {gameId} = useParams();
  const history = useHistory();
  const [roomId, setRoomId] = useState('');
  const roomsCollection = useFirestore().collection('rooms');
  const games = useFirestoreDocData(
      useFirestore().collection('games').doc(gameId),
  );

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
      <Navbar />
      <Box container='true' justify='center' alignItems='center' m={10}>
        <Description games={games} createRoom={createRoom} />
        <Spacer />
        <Grid container spacing={5}>
          <Grid item>
            <Typography variant='h4'>
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
                  setRoomId(e.target.value);
                }}
                type='text'
                variant='outlined'
              />
            </Grid>
            <Grid item className={classes.section}>
              <Button
                variant='contained'
                color='primary'
                onClick={joinRoom}
                m={5}>
                  Join Room
              </Button>
            </Grid>
          </Grid>
        </AuthCheck>
        <Spacer />
        <Rules
          videos={paginateVideos(games)}
        />
        <Spacer />
        <AllReviews gameId={gameId}/>
      </Box>
    </div>
  );
}

/**
 * @return {ReactElement} Spacing for different sections
 */
function Spacer() {
  return (
    <div>
      <br /> <br />
      <Divider />
      <br /> <br />
    </div>
  );
}

/**
 * @param {object} games Reference to game doc
 * @param {func} createRoom Creates game room for current game
 * @return {ReactElement} Description of game
 */
function Description({games, createRoom}) {
  const classes = useStyles();
  let description = 'Game is not available';
  let playTime = games.minPlaytime + '-' + games.maxPlaytime;
  let players = games.minPlayer + '-' + games.maxPlayer;
  if (games.description !== undefined) {
    description = games.description;
  }
  if (games.minPlaytime === games.maxPlaytime) {
    playTime = games.minPlaytime;
  }
  if (games.minPlayer === games.maxPlayer) {
    players = games.minPlayer;
  }
  return (
    <Grid container spacing={5}>
      <Grid item xs={2} className={classes.section}>
        <Card>
          <CardMedia
            component='img'
            image={games.image}
            title={games.Name}
          />
        </Card>
      </Grid>
      <Grid item xs={10} className={classes.section}>
        <Grid item>
          <Typography variant='h2' className={classes.fonts}>
            {games.Name}
          </Typography>
          <br />
          <Typography variant='body1'>
            {description}
          </Typography>
          <br />
          <Typography variant='body2' color='textSecondary' component='p'>
            <Icon aria-label='share'>
              <Star />{games.rating.toFixed(2)}/10
            </Icon>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Icon aria-label='share'>
              <Face />{games.minAge}+
            </Icon>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Icon aria-label='share'>
              <Timer />{playTime}
            </Icon>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Icon aria-label='share'>
              <People />{players}
            </Icon>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Icon aria-label='share'>
              <SignalCellular3Bar />{games.weight.toFixed(2)}
            </Icon>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <AuthCheck>
              <Button
                variant='contained'
                color='primary'
                onClick={createRoom}>
                Create Room
              </Button>
            </AuthCheck>
          </Typography>
        </Grid>
        <br />
      </Grid>
    </Grid>
  );
}

/**
 * @param {object} videos Object containing all rules videos
 * @return {ReactElement} Videos describing rules for game
 */
function Rules({videos}) {
  const classes = useStyles();
  const [page, setPage] = React.useState(1);
  if (Object.keys(videos).length === 0) {
    return (
      <Typography variant='h4'>
        No rules available
      </Typography>
    );
  }
  return (
    <Box>
      <Box>
        <Grid container>
          <Grid item>
            <Typography variant='h4'>
              Rules
            </Typography>
          </Grid>
        </Grid>
        <br />
        <Grid container justify="flex-start" alignItems="stretch" spacing={4}>
          {videos[page-1].map((video) => {
            return (
              <Grid item
                key={video.link}
                className={classes.section}
                xs={12} sm={6} xl={2} lg={3} md={4}
              >
                <VideoCard video={video} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <Pagination
        count={videos.length}
        boundaryCount={2}
        onChange={(e, p) => setPage(p)}
        className={classes.pagination}
      />
    </Box>
  );
}

/**
 * Sets up array of videos for pagination
 * @param {array} videos Array of videos for game page
 * @return {array} Nested array for videos
 */
function paginateVideos({videos}) {
  const allVideos = [];
  let list = [];
  videos.forEach((video) => {
    list.push(video);
    if (list.length === 12) {
      allVideos.push(list);
      list = [];
    }
  });
  if (list.length !== 0) {
    allVideos.push(list);
  }
  return allVideos;
}

Description.propTypes = {
  createRoom: PropTypes.func,
  games: PropTypes.shape({
    minPlayer: PropTypes.number,
    maxPlayer: PropTypes.number,
    minPlaytime: PropTypes.number,
    maxPlaytime: PropTypes.number,
    minAge: PropTypes.number,
    description: PropTypes.string,
    Name: PropTypes.string,
    image: PropTypes.string,
    rating: PropTypes.number,
    weight: PropTypes.number,
  }),
};

Rules.propTypes = {
  videos: PropTypes.array,
};
