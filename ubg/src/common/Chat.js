import React, {useState, useRef, useEffect} from 'react';
import Slide from '@material-ui/core/Slide';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
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
function Chat({open, messages, room, displayName, mafia, disabled}) {
  const classes = useStyles();
  const fieldValue = firebase.firestore.FieldValue;
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  /**
   * Post message to database
   */
  function addMessage() {
    const today = new Date();
    const hours = today.getUTCHours();
    const minutes = today.getUTCMinutes();
    if (mafia) {
      room.update(
          {mafiaChat: fieldValue.arrayUnion(
              {text: newMessage, user: displayName, isGameText: false,
                hours, minutes},
          )},
      );
    } else {
      room.update(
          {chat: fieldValue.arrayUnion(
              {text: newMessage, user: displayName, isGameText: false,
                hours, minutes},
          )},
      );
    }
    setNewMessage('');
  }

  /**
   * Get local time from UTC time
   * @param {number} hours
   * @param {number} minutes
   * @return {string} local time
   */
  function getLocalTime(hours, minutes) {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    let localMinutes = minutes - offset%60;
    let localHours = hours - Math.floor(offset/60);
    if (localMinutes < 0) {
      localMinutes += 60;
      localHours --;
    } else if (localMinutes > 60) {
      localMinutes -= 60;
      localHours ++;
    }
    if (localHours === 24) {
      localHours = 0;
    } else if (localHours === -1) {
      localHours = 23;
    }
    localMinutes = ('0' + localMinutes).slice(-2);
    localHours = ('0' + localHours).slice(-2);
    return `${localHours}:${localMinutes}`;
  }

  /**
   * Scroll to the bottom of chat
   */
  function scrollToBottom() {
    setTimeout(function() {
      if (open && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
      }
    }, 100);
  }

  useEffect(scrollToBottom, [messages, open]);

  return (
    <Slide
      direction="up"
      in={open}
      mountOnEnter
      unmountOnExit
      timeout={100}
    >
      <div className={classes.chatContainer}>
        <div className={classes.chatMessages}>
          { messages ?
              messages.map((message, index) => {
                return (
                  <Message
                    key={index}
                    user={message.user}
                    text={message.text}
                    isGameText={message.isGameText}
                    time={getLocalTime(message.hours, message.minutes)}
                  />
                );
              }) :
              null
          }
          <div ref={messagesEndRef} />
        </div>
        <div className={classes.sendMessage}>
          <input
            disabled={disabled}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
            type='text'
            className={classes.chatField}
            onKeyDown={(e) => {
              if (e.keyCode === 13 && newMessage.trim() !== '') {
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
  displayName: PropTypes.string,
  room: PropTypes.object,
  mafia: PropTypes.bool,
  disabled: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  displayName: state.currentUser.displayName,
});

export default connect(
    mapStateToProps,
    {},
)(Chat);
