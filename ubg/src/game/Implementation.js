import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import {AuthCheck} from 'reactfire';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  grid: {
    marginTop: theme.spacing(1),
  },
  section: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

/**
 * @param {string} user name of the user who sent the message
 * @param {string} text text of the message
 * @param {string} time time that the message was sent
 * @param {bool} bool if text is from game or user
 * @return {ReactElement} Div with message info
 */
export default function Implementation({gameId, gamesCollection, implementations}) {
  const classes = useStyles();
  const [link, setLink] = useState('');
  const [linkName, setLinkName] = useState('');

  /**
   * Add link to implementations
   */
  function addImplementationLink() {
    if (link !== '' && linkName !== '') {
      try {
        new URL(link);
      } catch (_) {
        return;  
      }
      let links = implementations;
      links.push({'name': linkName, 'link': link});
      gamesCollection.doc(gameId).update({'implementations':links});
    }
    setLink('');
    setLinkName('');
  }
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant='h4'>
            Implementations
          </Typography>
        </Grid>
        {implementations.map((l, index) => {
            return (
              <Grid item
                key={index}
                className={classes.section}
              >
                <Link target="_blank" href={l.link} >
                  {l.name}
                </Link>
              </Grid>
            );
          })}
      </Grid>
      <br />
      <AuthCheck>
        <Typography variant='h6'>
          Add Implementation Link
        </Typography>
        <Grid container spacing={3}>
          <Grid item className={classes.grid}>
            <TextField
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
              }}
              type='text'
              variant='outlined'
              placeholder='Enter link'
            />
          </Grid>
          <Grid item className={classes.grid}>
            <TextField
              value={linkName}
              onChange={(e) => {
                setLinkName(e.target.value);
              }}
              type='text'
              variant='outlined'
              placeholder='Enter link name'
            />
          </Grid>
          <Grid item className={classes.section}>
            <Button
              variant='contained'
              color='primary'
              onClick={addImplementationLink}
              m={5}>
                Add Link
            </Button>
          </Grid>
        </Grid>
      </AuthCheck>
    </Box>
  );
}

Implementation.propTypes = {
  gameId: PropTypes.string,
  gamesCollection: PropTypes.object,
  implementations: PropTypes.array,
};
