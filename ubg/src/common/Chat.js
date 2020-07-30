import React, {useState} from 'react';
import Slide from '@material-ui/core/Slide';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useFirestore } from 'reactfire';

const useStyles = makeStyles((theme) => ({
  chatContainer: {
    background: 'white',
    height: '50vh',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  chatMessages: {
      flexGrow: 1,
  },
}));

/**
 * @param {boolean} open Declares if the drawer is open
 * @param {array} messages Messages in chat
 * @return {ReactElement} Drawer with chat
 */
export default function Chat({open, messages, roomId, user}) {
  const classes = useStyles();
  const fieldValue = firebase.firestore.FieldValue;
  const roomDoc = useFirestore().collection('rooms').doc(roomId);
  const [newMessage, setNewMessage] = useState("");

  function addMessage() {
    roomDoc.update({chat: fieldValue.arrayUnion({text: newMessage, user})});
  }

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <div className={classes.chatContainer}>
        <div className={classes.chatMessages}>
            <ul>
                {
                    messages.map((message) => {
                        return (
                            <li>{message.user}: {message.text}</li>
                        )
                    })
                }
            </ul>
        </div>
        <div>
            <TextField
                value={newMessage}
                onChange={(e) => {
                    setNewMessage(e.target.value);
                }}
                type='text'
                variant='outlined'
            />
            <Button
                variant='contained'
                color='primary'
                onClick={addMessage}
            >
                Send
            </Button>
        </div>
      </div>
    </Slide>
  );
}

Chat.propTypes = {
  open: PropTypes.bool,
  messages: PropTypes.array,
};
