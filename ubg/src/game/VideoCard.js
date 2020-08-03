import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import {Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
    height: '100%',
  },
  videoName: {
    'white-space': 'nowrap',
    'overflow': 'hidden',
    'text-overflow': 'ellipsis',
  },
}));

/**
 * @param {object} video A video object with video info
 * @return {ReactElement} A card element for a video
 */
export default function VideoCard({video}) {
  const classes = useStyles();
  const link = video.link.replace('watch?v=', 'embed/');

  return (
    <Card className={classes.card}>
      <CardMedia
        component='iframe'
        src={link}
        image={link}
        alt={video.title}
        className={classes.media}
        height='315'
        width='560'
      />
      <CardContent>
        <Typography
          gutterBottom variant='h5' 
          component='h2'
          className={classes.videoName}>
          {video.title}
        </Typography>
        <br />
        <Typography variant='body1'>
          Category: {video.category}
          <br />
          Language: {video.language}
          <br />
          Post Date: {video.postdate}
        </Typography>
      </CardContent>
    </Card>
  );
}

VideoCard.propTypes = {
  video: PropTypes.shape({
    link: PropTypes.string,
    title: PropTypes.string,
    category: PropTypes.string,
    language: PropTypes.string,
    postdate: PropTypes.string,
  }),
};
