import React, {useState}  from 'react';
import Navbar from '../common/Navbar';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import {useFirestore} from 'reactfire';

const useStyles = makeStyles((theme) => ({
  grid: {
    backgroundColor: '#dcdef5',
    marginTop: '1em',
  },
  text: {
    color: '#3f51b5',
  },
}));

/**
 * @return {ReactElement} About page
 */
export default function Friends() {
  const classes = useStyles();
  const [id, setId] = useState('');
  const [search, setSearch] = useState(false);
  const [user, setUser] = React.useState('');
  const ref = useFirestore().collection('users');

  function searchId() {
    const docRef = ref.doc(id);
    docRef.get().then(function(doc) {
      if (doc.exists) {
        setUser(doc.data());
          console.log("Document data:", doc.data());
          setSearch(true);
      } else {
        setUser('');
        setSearch(true);
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }

  return (
    <div>
      <Navbar />
      <Box
        container='true'
        m={10}
      >
        <Typography
          variant='h3'
        >
          Find Friends
        </Typography>
        <TextField
          value={id}
          onChange={(e) => {
            setId(e.target.value);
          }}
          type='text'
          variant='outlined'
          placeholder='Enter ID'
        />
        <Button
          variant='contained'
          color='primary'
          onClick={searchId}
          m={5}>
            Search Friend
        </Button>
        <Divider />
        {search ? 
        user === '' ? 
        <Typography
          variant='h6'
        >
          Id not Found
        </Typography> : 
        <Link href="#">
          {user.displayName}
        </Link> :
        null
        }
      </Box>
    </div>
  );
}
