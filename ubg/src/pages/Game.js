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
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import PropTypes from 'prop-types';
import * as firebase from 'firebase/app';
import Implementation from '../game/Implementation';
import Videos from '../game/Videos';
import CreateEventButton from '../game/CreateEventButton';
import NotFound from '../pages/NotFound';

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
  arrowBack: {
    float: 'left',
    marginLeft: '0.4em',
    marginTop: '0.4em',
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
  const roomsCollection = useFirestore().collection('rooms');
  const usersCollection = useFirestore().collection('users');
  const gamesCollection = useFirestore().collection('games');

  const game = useFirestoreDocData(gamesCollection.doc(gameId));

  /**
   * Creates a room in firebase and adds the current user as host
   */
  async function createRoom() {
    const newRoom = await roomsCollection.doc();
    newRoom.set({gameId, host: user.uid, chat: [], started: false});
    history.push(`/gameRoom/${newRoom.id}`);
  }
  /**
   * Creates a room in firebase and return room id
   */
  async function createRoomLink() {
    const newRoom = await roomsCollection.doc();
    newRoom.set({gameId, host: user.uid, chat: [], started: false});
    return newRoom.id;
  }

  /**
   * @param {string} id room id
   * Delete room in firebase
   */
  async function deleteRoom(id) {
    roomsCollection.doc(id).delete();
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

  if (isEmpty(game)) {
    return (
      <NotFound />
    );
  } else {
    return (
      <div>
        <Navbar />
        <IconButton
          color="primary"
          component="span"
          onClick={() => history.goBack()}
          className={classes.arrowBack}
        >
          <ArrowBack fontSize="large" />
        </IconButton>
        <Box container='true' justify='center' alignItems='center' m={10}>
          <Description
            usersCollection={usersCollection}
            game={game}
            createRoom={createRoom}
            gameId={gameId}
            createRoomLink={createRoomLink}
            deleteRoom={deleteRoom}
          />
          <Spacer />
          <Implementation
            gameId={gameId}
            gamesCollection={gamesCollection}
            implementations={game.implementations}
          />
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
 * @param {func} createRoomLink Creates game room
 * @param {func} deleteRoom delete room from database
 * @return {ReactElement} Description of game
 */
function Description(
    {usersCollection, game, createRoom, gameId, createRoomLink, deleteRoom}) {
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
              <br /> <br />
              <Grid container spacing={3}>
                {gameId === '925' ?
                  <Grid item>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={createRoom}>
                      Create Room
                    </Button>
                  </Grid> :
                  null
                }
                <Grid item>
                  <FavoriteButton
                    usersCollection={usersCollection}
                    game={game}
                  />
                </Grid>
                <Grid item>
                  <CreateEventButton
                    gameName={game.Name}
                    gameId={gameId}
                    createRoomLink={createRoomLink}
                    deleteRoom={deleteRoom}
                  />
                </Grid>
              </Grid>
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
      Name: game.Name,
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
  createRoomLink: PropTypes.func,
  deleteRoom: PropTypes.func,
};

FavoriteButton.propTypes = {
  usersCollection: PropTypes.object,
  game: PropTypes.shape({
    id: PropTypes.number,
  }),
};
