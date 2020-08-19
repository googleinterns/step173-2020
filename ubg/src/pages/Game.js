import React, {Fragment, useState} from 'react';
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
import * as firebase from 'firebase/app';
import Pagination from '@material-ui/lab/Pagination';
import VideoCard from '../game/VideoCard';
import NotFound from '../pages/NotFound';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ApiCalendar from 'react-google-calendar-api';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

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
  textField: {
    marginRight: theme.spacing(2),
    width: 200,
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
  const usersCollection = useFirestore().collection('users');

  const game = useFirestoreDocData(
      useFirestore().collection('games').doc(gameId));

  /**
   * Creates a room in firebase and adds the current user as host
   */
  async function createRoom() {
    const newRoom = await roomsCollection.doc();
    newRoom.set({gameId, host: user.uid, chat: [], started: false});
    history.push(`/gameRoom/${newRoom.id}`);
  }
  /**
   * Go to a rooms url with the room id
   */
  function joinRoom() {
    history.push(`/gameRoom/${roomId}`);
  }

  /**
   * Check if obj is empty
   * @param {object} obj
   * @return {boolean} if obj is empty
   */
  function isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  if (isEmpty(game)) {
    return (
      <NotFound />
    );
  } else {
    return (
      <div>
        <Navbar />
        <Box container='true' justify='center' alignItems='center' m={10}>
          <Description
            usersCollection={usersCollection}
            game={game}
            createRoom={createRoom}
            gameId={gameId}
          />
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
          <Videos
            videos={paginateVideos(game.videos)}
          />
          <Spacer />
          <AllReviews gameId={gameId}/>
        </Box>
      </div>
    );
  }
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
 * @param {object} usersCollection User collection
 * @param {object} game Reference to game doc
 * @param {func} createRoom Creates game room for current game
 * @return {ReactElement} Description of game
 */
function Description({usersCollection, game, createRoom, gameId}) {
  const classes = useStyles();
  let playTime = game.minPlaytime + '-' + game.maxPlaytime;
  let players = game.minPlayer + '-' + game.maxPlayer;
  if (game.minPlaytime === game.maxPlaytime) {
    playTime = game.minPlaytime;
  }
  if (game.minPlayer === game.maxPlayer) {
    players = game.minPlayer;
  }
  /**
   * @return {object} inner HTML
   */
  function createMarkup() {
    return {__html: game.description};
  }

  return (
    <Grid container spacing={5}>
      <Grid item xs={2} className={classes.section}>
        <Card>
          <CardMedia
            component='img'
            image={game.image}
            title={game.Name}
          />
        </Card>
      </Grid>
      <Grid item xs={10} className={classes.section}>
        <Grid item>
          <Typography variant='h2' className={classes.fonts}>
            {game.Name}
          </Typography>
          <br />
          <div
            dangerouslySetInnerHTML={createMarkup()}
          >
          </div>
          <br />
          <Typography variant='body2' color='textSecondary' component='div'>
            <Icon aria-label='share'>
              <Star />{game.rating.toFixed(2)}/10
            </Icon>
            &emsp;
            <Icon aria-label='share'>
              <Face />{game.minAge}+
            </Icon>
            &emsp;
            <Icon aria-label='share'>
              <Timer />{playTime}
            </Icon>
            &emsp;
            <Icon aria-label='share'>
              <People />{players}
            </Icon>
            &emsp;
            <Icon aria-label='share'>
              <SignalCellular3Bar />{game.weight.toFixed(2)}
            </Icon>
            &emsp;
            <AuthCheck>
              {gameId === '925' ?
                <Button
                  variant='contained'
                  color='primary'
                  onClick={createRoom}>
                  Create Room
                </Button> :
                null
              }
              &emsp;
              <FavoriteButton usersCollection={usersCollection} game={game}/>
              <CreateEventButton gameName={game.Name}/>
            </AuthCheck>
          </Typography>
        </Grid>
        <br />
      </Grid>
    </Grid>
  );
}

/**
 * @param {object} usersCollection User collection
 * @param {object} game Current game object containing game information
 * @return {ReactElement} Button to add/delete game from favorites
 */
function FavoriteButton({usersCollection, game}) {
  const user = useUser();
  const userGames = useFirestoreDocData(
      usersCollection.doc((user && user.uid) || ' ')).games;
  const [favorite, setFavorite] = useState(inFavorites(userGames, game));

  return (
    {user} ?
    (
      <Button
        variant='contained'
        color='primary'
        onClick={() => addFavorite(
            userGames, usersCollection, game, favorite, setFavorite, user.uid)}>
        {favorite ? 'Delete from favorites' : 'Add to favorites'}
      </Button>
    ) : null
  );
}

function CreateEventButton({gameName}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [summary, setSummary] = React.useState('🎮 ' + gameName + ' 🎮');
  const [startTime, setStartTime] = React.useState(new Date());
  const [endTime, setEndTime] = React.useState(new Date());

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSummary('🎮 ' + gameName + ' 🎮');
    setStartTime(new Date());
    setEndTime(new Date());
  };

  const handleSave = () => {
    setOpen(false);
    if (ApiCalendar.sign === false) {
      ApiCalendar.handleAuthClick();
      }
      const event = {
        'summary': summary,
        'description': 'A chance to hear more about Google\'s developer products.',
        'start': {
          'dateTime': startTime.toISOString(),
          'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        'end': {
          'dateTime': endTime.toISOString(),
          'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      }
      ApiCalendar.createEvent(event)
  .then((result) => {
    console.log(result);
      })
   .catch((error) => {
     console.log(error);
      });
    setSummary('🎮 ' + gameName + ' 🎮');
    setStartTime(new Date());
    setEndTime(new Date());
  };

  return (
    <div>
      <Button variant='contained'
        color='primary' onClick={handleClickOpen}>
        Create Event
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Event Summary"
            value={summary}
            onChange={(e)=> setSummary(e.target.value)}
            fullWidth
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DateTimePicker
            label="Start Time"
            value={startTime}
            onChange={setStartTime}
            className={classes.textField}
            showTodayButton
            disablePast
          />
          <DateTimePicker
            label="End Time"
            value={endTime}
            onChange={setEndTime}
            className={classes.textField}
            showTodayButton
            disablePast
          />
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

/**
 * @param {object} videos Object containing all videos
 * @return {ReactElement} Videos describing the game
 */
function Videos({videos}) {
  const classes = useStyles();
  const [page, setPage] = React.useState(1);
  if (Object.keys(videos).length === 0) {
    return (
      <Typography variant='h4'>
        No videos available
      </Typography>
    );
  }
  return (
    <Box>
      <Box>
        <Grid container>
          <Grid item>
            <Typography variant='h4'>
              Videos
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
 * Check if game is included in favorite games
 * @param {array} userGames of current user's favorite games
 * @param {object} game Firestore doc of current game
 * @return {bool} whether game is in favorite games
 */
function inFavorites(userGames, game) {
  for (let i = 0; i < userGames.length; i++) {
    if (userGames[i].id === game.id) {
      return true;
    }
  }
  return false;
}

/**
 * Based on state of favorite, adds or deletes current game from favorites
 * @param {array} userGames Array of current user's favorite games
 * @param {object} usersCollection User collection
 * @param {object} game Firestore doc of current game
 * @param {bool} favorite Whether current game is in user's favorites
 * @param {func} setFavorite Sets whether current game is in user's favorites
 * @param {number} uid ID od current user
 * @return {void}
 */
function addFavorite(userGames, usersCollection,
    game, favorite, setFavorite, uid) {
  if (favorite) {
    for (let i = 0; i < userGames.length; i++) {
      if (userGames[i].id === game.id) {
        userGames.splice(i, 1);
        if (userGames.length === 0) {
          usersCollection.doc(uid).update({
            games: [],
          });
        } else {
          usersCollection.doc(uid).update({
            games: userGames,
          });
        }
        setFavorite(false);
        return;
      }
    }
  } else {
    userGames.push({
      id: game.id,
      image: game.image,
      name: game.Name,
      year: game.year,
      minPlaytime: game.minPlaytime,
      maxPlaytime: game.maxPlaytime,
      minPlayer: game.minPlayer,
      maxPlayer: game.maxPlayer,
      rating: game.rating,
      minAge: game.minAge,
      weight: game.weight,
    });
    usersCollection.doc(uid).update({
      games: firebase.firestore.FieldValue.arrayUnion(...userGames),
    });
    setFavorite(true);
  }
}

/**
 * Sets up array of videos for pagination
 * @param {array} videos Array of videos for game page
 * @return {array} Nested array for videos
 */
function paginateVideos(videos) {
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
  usersCollection: PropTypes.object,
  createRoom: PropTypes.func,
  game: PropTypes.shape({
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
  gameId: PropTypes.string,
};

Videos.propTypes = {
  videos: PropTypes.array,
};

FavoriteButton.propTypes = {
  usersCollection: PropTypes.object,
  game: PropTypes.shape({
    id: PropTypes.number,
  }),
};
