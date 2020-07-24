import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Star from '@material-ui/icons/Star';
import Timer from '@material-ui/icons/Timer';
import People from '@material-ui/icons/People';
import Face from '@material-ui/icons/Face';
import SignalCellular3Bar from '@material-ui/icons/SignalCellular3Bar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Navbar from '../common/Navbar';
import { useFirestore}  from 'reactfire';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    marginTop: theme.spacing(1.5),
    marginRight: theme.spacing(3),
    float: "right",
  },
  card: {
    width: 370,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 130,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  }
}));

let initialize = false;

export default function Home() {
  const classes = useStyles();
  let ref = useFirestore().collection('games');
  const [minAge, setMinAge] = React.useState(21);
  const [minPlayer, setMinPlayer] = React.useState(1);
  const [maxPlayer, setMaxPlayer] = React.useState('8+');
  const [minTime, setMinTime] = React.useState(5);
  const [maxTime, setMaxTime] = React.useState('240+');
  const [games, setGames] = React.useState([]);
  let handleFilter = () => {
    let newGames = [];
    let maxP = maxPlayer; 
    if (typeof maxP === 'string') {
      maxP = Number.MAX_SAFE_INTEGER;
    }
    let maxT = maxTime;
    if (typeof maxT === 'string') {
      maxT = Number.MAX_SAFE_INTEGER;
    }
    ref.orderBy('rating', "desc")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          if (doc.data()['minPlayer'] <= maxP && minPlayer <= doc.data()['maxPlayer'] 
          && doc.data()['minPlaytime'] <= maxT && minTime <= doc.data()['maxPlaytime']
          && doc.data()['minAge'] <= minAge) {
            newGames.push(doc.data());
          }
        });
        setGames(newGames);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }
  useEffect(() => {
    // using a hack to make useEffect act as onLoad()
    if (initialize === false){
      console.log("4");
      let newGames = [];
      ref.orderBy('rating', "desc")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          newGames.push(doc.data());
        });
        setGames(newGames);
        initialize = true;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    }
  }, [ref]);

  return (
    <div>
      <Navbar/>
      <Box  boxShadow={1} m={10}>
        <Filter label = "Minimum Age" value={minAge} menu={[8, 10, 14, 16, 21]} onChange={(v) => setMinAge(v)} />
        <Filter label = "Minimum Player" value={minPlayer} menu={[1, 2, 3, 4, 5, 6, 7, 8]} onChange={(v) => setMinPlayer(v)}/>
        <Filter label = "Maximum Player" value={maxPlayer} menu={[1, 2, 3, 4, 5, 6, 7, '8+']} onChange={(v) => setMaxPlayer(v)} />
        <Filter label = "Minimum Time" value={minTime} menu={[5, 15, 30, 60, 90, 120]} append={'min'} onChange={(v) => setMinTime(v)} />
        <Filter label = "Maximum Time" value={maxTime} menu={[15, 30, 60, 90, 120, '240+']} append={'min'} onChange={(v) => setMaxTime(v)} />
        <Button className={classes.button} variant="contained" onClick={() => handleFilter()}>Search</Button>
      </Box>
      <Box ml={10}>
        <Grid container justify="flex-start" alignItems="center" spacing={4}>
        {games.map((item) => 
          <Grid key={item['id']} item>
            <GameCard id={item['id']}  image={item['image']} name={item['Name']} year={item['year']} minTime={item['minPlaytime']} 
            maxTime={item['maxPlaytime']} minPlayer={item['minPlayer']} maxPlayer={item['maxPlayer']} rating={item['rating']} 
            minAge={item['minAge']} weight={item['weight']} />
          </Grid>
        )}
        </Grid>
      </Box>
    </div>
  );
}

function Filter(props) {
  const classes = useStyles();
  let append = '';
  if (props.append) {
    append = props.append;
  }
  return (
    <FormControl className={classes.formControl}>
      <InputLabel shrink id="demo-simple-select-placeholder-label-label">
        {props.label}
      </InputLabel>
      <Select
        labelId="demo-simple-select-placeholder-label-label"
        id="demo-simple-select-placeholder-label"
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
        displayEmpty
        className={classes.selectEmpty}
      >
        {props.menu.map((item) => <MenuItem key={item} value={item}>{item}{append}</MenuItem>)}
      </Select>
    </FormControl>
  );
}

function GameCard(props) {
  const classes = useStyles();
 let name = props.name;
  if (props.name.length > 27) {
    name = name.substring(0, 27) + "...";
  }
  const rating = (props.rating).toFixed(2);
  const weight = (props.weight).toFixed(2);
  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="300"
          image={props.image}
          title="Random Image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}  
          </Typography>
            <Grid container alignItems="center" >
              <Grid item xs={5}>
                <Star /> {rating}/10
              </Grid>
              <Grid item xs={3}>
                <Face /> {props.minAge}+
              </Grid>
              <Grid item xs={4}>
                <People /> 
                {props.minPlayer !== props.maxPlayer ? <span>{props.minPlayer}-</span> : null }
                {props.maxPlayer}
              </Grid>
              <br />
              <Grid item xs={6}><Timer /> 
                {props.minTime !== props.maxTime ? <span>{props.minTime}-</span> : null }
                {props.maxTime}min
              </Grid>
              <Grid item xs={6}>
                <SignalCellular3Bar /> {weight}/10
              </Grid>
            </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}