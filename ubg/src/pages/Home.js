import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Typography from '@material-ui/core/Typography';
import Star from '@material-ui/icons/Star';
import Timer from '@material-ui/icons/Timer';
import People from '@material-ui/icons/People';
import Grid from '@material-ui/core/Grid';
import Navbar from '../common/Navbar';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    maxWidth: 390,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function Home() {
  const [minAge, setMinAge] = React.useState('1');
  const [maxAge, setMaxAge] = React.useState('Max');
  const [minPlayer, setMinPlayer] = React.useState('1');
  const [maxPlayer, setMaxPlayer] = React.useState('8');
  const [minTime, setMinTime] = React.useState('5min');
  const [maxTime, setMaxTime] = React.useState('Max');
  return (
    <div>
      <Navbar/>
      <Box boxShadow={1} m={10}>
        <Filter label = "Minimum Age" value={minAge} menu={[5, 10, 16, 20, 35]} max={false} onChange={(v) => setMinAge(v)} />
        <Filter label = "Maximum Age" value={maxAge} menu={[5, 10, 16, 20, 35]} max={true} onChange={(v) => setMaxAge(v)} />
        <Filter label = "Minimum Player" value={minPlayer} menu={[2, 3, 4, 5, 6, 7, 8]} max={false} onChange={(v) => setMinPlayer(v)}/>
        <Filter label = "Maximum Player" value={maxPlayer} menu={[1, 2, 3, 4, 5, 6, 7]} max={true} onChange={(v) => setMaxPlayer(v)} />
        <Filter label = "Minimum Time" value={minTime} menu={['15min', '30min', '1h', '1h30min', '2h']} max={false} onChange={(v) => setMinTime(v)} />
        <Filter label = "Maximum Time" value={maxTime} menu={['5min', '15min', '30min', '1h', '1h30min', '2h']} max={true} onChange={(v) => setMaxTime(v)} />
      </Box>
      <Box m={10}>
        <Grid container justify="center" alignItems="center" spacing={7}>
          <Grid item>
            <ImgMediaCard />
          </Grid>
          <Grid item >
            <ImgMediaCard />
          </Grid>
          <Grid item >
            <ImgMediaCard />
          </Grid>
          <Grid item >
            <ImgMediaCard />
          </Grid>
          <Grid item >
            <ImgMediaCard />
          </Grid>
          <Grid item >
            <ImgMediaCard />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}


function Filter(props) {
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl}>
      <InputLabel shrink id="demo-simple-select-placeholder-label-label">
        {props.label}
      </InputLabel>
      <Select
        labelId="demo-simple-select-placeholder-label-label"
        id="demo-simple-select-placeholder-label"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        displayEmpty
        className={classes.selectEmpty}
      >
        {props.max === true? null : <MenuItem value={props.value}>{props.value}</MenuItem> }
        {props.menu.map((item)=><MenuItem value={item}>{item}</MenuItem>)}
        {props.max === true? <MenuItem value={props.value}>{props.value}</MenuItem>: null }
      </Select>
    </FormControl>
  );
}

function ImgMediaCard() {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="140"
          image=""
          title="Random Image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            dfgsdfgsdf
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            <IconButton aria-label="share">
              <Star /> 8.9/10
            </IconButton>
            <IconButton aria-label="share">
              <Timer /> 1h-2h
            </IconButton>
            <IconButton aria-label="share">
              <People /> 2-5
            </IconButton>
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
