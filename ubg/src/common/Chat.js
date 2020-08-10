import React, {useState, useRef, useEffect} from 'react';
import Slide from '@material-ui/core/Slide';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import {useFirestore} from 'reactfire';
import Message from './Message';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import {connect} from 'react-redux';

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
    margin: '5px 10px',
    overflow: 'scroll',
  },
  sendMessage: {
    display: 'flex',
    justifyContent: 'center',
    margin: '10px',
  },
  chatField: {
    flexGrow: 1,
    minWidth: '10px',
  },
}));

/**
 * @param {boolean} open Declares if the drawer is open
 * @param {array} messages Messages in chat
 * @return {ReactElement} Drawer with chat
 */
function Chat({open, messages, roomId, displayName}) {
  const classes = useStyles();
  const fieldValue = firebase.firestore.FieldValue;
  const roomDoc = useFirestore().collection('rooms').doc(roomId);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  /**
   * Post message to database
   */
  function addMessage() {
    const today = new Date();
    const hours = ('0' + today.getHours()).slice(-2);
    const minutes = ('0' + today.getMinutes()).slice(-2);
    const time = `${hours}:${minutes}`;
    roomDoc.update(
        {chat: fieldValue.arrayUnion(
            {text: newMessage, user: displayName, time},
        )},
    );
    setNewMessage('');
  }

  /**
   * Scroll to the bottom of chat
   */
  function scrollToBottom() {
    if (open) {
      messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }

  useEffect(scrollToBottom, [messages]);

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <div className={classes.chatContainer}>
        <div className={classes.chatMessages}>
          { messages ?
              messages.map((message, index) => {
                return (
                  <Message
                    key={index}
                    user={message.user}
                    text={message.text}
                    time={message.time}
                  />
                );
              }) :
              null
          }
          <div ref={messagesEndRef} />
        </div>
        <div className={classes.sendMessage}>
          <input
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
            type='text'
            className={classes.chatField}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                addMessage();
              }
            }}
          />
          <IconButton
            disabled={newMessage === ''}
            color="primary"
            className={classes.margin}
            size="small"
            onClick={addMessage}
          >
            <SendIcon fontSize="inherit" />
          </IconButton>
        </div>
      </div>
    </Slide>
  );
}

Chat.propTypes = {
  open: PropTypes.bool,
  messages: PropTypes.array,
  roomId: PropTypes.string,
  displayName: PropTypes.string,
};

const mapStateToProps = (state) => ({
  displayName: state.currentUser.displayName,
  messages: state.roomData.chat,
});

export default connect(
    mapStateToProps,
    {},
)(Chat);
