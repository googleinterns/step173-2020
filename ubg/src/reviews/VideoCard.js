import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Typography } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import ReactPlayer from 'react-player';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'block',
    width: '100%',
  },
  video: {
    height: '100%',
    width: '100%',
  },
  videoName: {
    'white-space': 'nowrap',
    'overflow': 'hidden',
    'text-overflow': 'ellipsis',
  },
  content: {
    alignItems: 'center',
  },
}));

export default function VideoCard({video}) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
        {/* <CardMedia
            image={video.link}
        /> */}
        <ReactPlayer
          className={classes.video}
          url={video.link}
        />
        <CardContent className={classes.content}>
          <Typography gutterBottom variant="h5" component="h2"
              className={classes.videoName}>
              {video.title}
            </Typography>
          <Grid container alignItems='center'>
            <Grid item xs={5}>
              <Typography variant='body1'>
                Language: {video.language}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant='body1'>
                Date Posted: {video.postdate}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
    </Card>
  );
}
