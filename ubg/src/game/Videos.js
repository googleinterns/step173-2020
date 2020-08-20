import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import VideoCard from './VideoCard';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  pagination: {
    '& > *': {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
  },
}));

/**
 * @param {object} videos Object containing all videos
 * @return {ReactElement} Videos describing the game
 */
export default function Videos({videos}) {
  const classes = useStyles();
  const [page, setPage] = useState(1);
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

Videos.propTypes = {
  videos: PropTypes.array,
};
