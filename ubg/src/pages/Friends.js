import React, {useState} from 'react';
import Navbar from '../common/Navbar';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import {useUser, useFirestore, useFirestoreDocData} from 'reactfire';
import UserResults from '../friend/UserResults';
import FriendRequests from '../friend/FriendRequests';

const useStyles = makeStyles((theme) => ({
  grid: {
    margin: '1em',
  },
}));

/**
 * @param {object} values input in Search Friend
 * @param {string} name name of user
 * @return {boolean} whether user name match search input
 */
const checkMatch = (values, name) => {
  for (let i = 0; i < values.length; i++) {
    if (name.toLowerCase().includes(values[i].toLowerCase())) {
      return true;
    }
  }
  return false;
};

/**
 * @return {ReactElement} Friend page
 */
export default function Friends() {
  const classes = useStyles();
  const user = useUser();
  const [value, setValue] = useState('');
  const [search, setSearch] = useState(false);
  const [users, setUsers] = useState([]);
  const ref = useFirestore().collection('users');
  const friendRequests = useFirestoreDocData(ref.doc(user.uid)).requests;
  /**
   * @return {void}
   */
  function searchFriend() {
    const docRef = ref.doc(value.trim());
    const allUsers = [];
    docRef.get().then(function(doc) {
      if (doc.exists) {
        const newUser = doc.data();
        newUser.id = value.trim();
        allUsers.push(newUser);
      }
    }).catch(function(error) {
      console.log('Error getting document:', error);
    });
    const values = value.trim().split(/ +/);
    ref.get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if (checkMatch(values, doc.data()['displayName'])) {
              const newUser = doc.data();
              newUser.id = doc.id;
              allUsers.push(newUser);
            }
          });
          setUsers(allUsers);
          setSearch(true);
        })
        .catch(function(error) {
          console.log('Error getting documents: ', error);
        });
  }

  return (
    <div>
      <Navbar />
      <Box
        container='true'
        m={10}
      >
        <Typography variant='h3'>
          Friend Requests
        </Typography>
        <br />
        {
          friendRequests.length === 0 ?
          <Typography variant='body1'>
            &nbsp;&nbsp;No new friend requests
          </Typography> :
          <FriendRequests users={friendRequests} currUser={user}/>
        }
        <br />
        <Divider />
        <br />
        <Typography
          variant='h3'
        >
          Find Friends
        </Typography>
        <Grid container spacing={3} className={classes.grid}>
          <Grid item>
            <TextField
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              type='text'
              variant='outlined'
              placeholder='Enter ID or name'
            />
          </Grid>
          <Grid item>
            <Button
              variant='contained'
              color='primary'
              onClick={searchFriend}
              m={5}>
                Search Friend
            </Button>
          </Grid>
        </Grid>
        <Divider />
        {search ?
        users.length === 0 ?
        <Typography
          variant='h6'
        >
          User not Found
        </Typography> :
        <UserResults users={users}></UserResults>:
        null
        }
      </Box>
    </div>
  );
}
