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
import IconButton from '@material-ui/core/IconButton';
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
  card: {
    width: 370,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  }
}));

export default function Home() {
  let ref = useFirestore().collection('games');
  const allGames = [];
  const [minAge, setMinAge] = React.useState(1);
  const [minPlayer, setMinPlayer] = React.useState(1);
  const [maxPlayer, setMaxPlayer] = React.useState('Max');
  const [minTime, setMinTime] = React.useState(5);
  const [maxTime, setMaxTime] = React.useState('Max');
  const [games, setGames] = React.useState([]);
  let handleFilter = () => {
    // setGames([]);
    let newGames = [];
    let maxP = maxPlayer;
    if (maxP === 'Max') {
      maxP = Number.MAX_SAFE_INTEGER;
    }
    let maxT = maxTime;
    if (maxT === 'Max') {
      maxT = Number.MAX_SAFE_INTEGER;
    }
    // for ()
    // ref.where("minAge","<=",minAge)
    // .get()
    // .then(function(querySnapshot) {
        allGames.forEach(function(doc) {
          if (doc.data()['minPlayer'] <= maxP && minPlayer <= doc.data()['maxPlayer'] 
          && doc.data()['minPlaytime'] <= maxT && minTime <= doc.data()['maxPlaytime']) {
            // console.log(doc.data());
            newGames.push(doc.data());
          }
        });
        setGames(newGames);
    // // console.log(newGames);
    // })
    // .catch(function(error) {
    //     console.log("Error getting documents: ", error);
    // });
  }
  useEffect(() => {
    ref
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // if (doc.data()['minPlayer'] <= maxP && minPlayer <= doc.data()['maxPlayer'] 
          // && doc.data()['minPlaytime'] <= maxT && minTime <= doc.data()['maxPlaytime']) {
            allGames.push(doc.data());
          // }
        });
        setGames(allGames);
    // console.log(newGames);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }, []);

  return (
    <div>
      <Navbar/>
      <Box  boxShadow={1} m={10}>
        <Filter label = "Minimum Age" value={minAge} menu={[8, 10, 14, 16, 21]} max={false} onChange={(v) => setMinAge(v)} />
        <Filter label = "Minimum Player" value={minPlayer} menu={[2, 3, 4, 5, 6, 7, 8]} max={false} onChange={(v) => setMinPlayer(v)}/>
        <Filter label = "Maximum Player" value={maxPlayer} menu={[1, 2, 3, 4, 5, 6, 7]} max={true} onChange={(v) => setMaxPlayer(v)} />
        <Filter label = "Minimum Time" value={minTime} menu={[15, 30, 60, 90, 120]} append={'min'} max={false} onChange={(v) => setMinTime(v)} />
        <Filter label = "Maximum Time" value={maxTime} menu={[15, 30, 60, 90, 120]} append={'min'} max={true} onChange={(v) => setMaxTime(v)} />
        <Button variant="contained" onClick={() => handleFilter()}>Search</Button>
      </Box>
      <Box m={10}>
        <Grid container justify="flex-start" alignItems="center" spacing={4}>
        {games.map((item) => 
          <Grid item>
            <GameCard image={item['image']} name={item['Name']} year={item['year']} minTime={item['minPlaytime']} 
            maxTime={item['maxPlaytime']} minPlayer={item['minPlayer']} maxPlayer={item['maxPlayer']} rating={item['rateing']} 
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
        {props.max === true ? null : <MenuItem value={props.value}>{props.value}{append}</MenuItem> }
        {props.menu.map((item) => <MenuItem value={item}>{item}</MenuItem>)}
        {props.max === true ? <MenuItem value={props.value}>{props.value}{append}</MenuItem>: null }
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
          <Typography variant="body2" color="textSecondary" component="p">
            <IconButton aria-label="share">
              <Star /> {props.rating}/10
            </IconButton>
            <IconButton aria-label="share">
              <Face /> {props.minAge}+
            </IconButton>
            <IconButton aria-label="share">
              <People /> {props.minPlayer}-{props.maxPlayer}
            </IconButton>
            <br />
            <IconButton aria-label="share">
              <Timer /> {props.minTime}-{props.maxTime}min
            </IconButton>
            <IconButton aria-label="share">
              <SignalCellular3Bar /> {props.weight}/10
            </IconButton>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}