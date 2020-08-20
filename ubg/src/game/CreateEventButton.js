import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import ApiCalendar from 'react-google-calendar-api';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  emails: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
    minHeight: '40px',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  textField: {
    marginRight: theme.spacing(2),
    width: 200,
  },
}));

/**
 * @param {string} gameName game name
 * @param {string} gameId game id
 * @param {func} createRoomLink Creates game room 
 * @param {func} deleteRoom delete room from database
 * @return {ReactElement} Add game event button
 */

export default function CreateEventButton({gameName, gameId, createRoomLink, deleteRoom}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState('🎮 ' + gameName + ' 🎮');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [description, setDescription] = useState('');
  const [roomId, setRoomId] = useState('');
  const [email, setEmail] = React.useState('');
  const [emails, setEmails] = React.useState([]);

  const handleClickOpen = async () => {
    setOpen(true);
    if (gameId === '925') {
      const newRoomId = await createRoomLink();
      setRoomId(newRoomId);
      setDescription("Join game with this link: " + 
      window.location.href.substring(0,window.location.href.lastIndexOf("/")) +
      "/gameRoom/" + newRoomId);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSummary('🎮 ' + gameName + ' 🎮');
    setStartTime(new Date());
    setEndTime(new Date());
    setDescription('');
    if (gameId === '925') {
      deleteRoom(roomId);
      setRoomId('');
    }
    setEmail('');
    setEmails([]);
  };

  const handleSave = () => {
    setOpen(false);
    if (ApiCalendar.sign === false) {
      ApiCalendar.handleAuthClick();
    }
    let eventEndTime = endTime;
    if (startTime > endTime) {
      setEndTime(startTime);
      eventEndTime = startTime;
    }
    const event = {
      'summary': summary,
      'description': description,
      'start': {
        'dateTime': startTime.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      'end': {
        'dateTime': eventEndTime.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      'attendees': emails,
    }
    ApiCalendar.createEvent(event)
      .then((result) => {})
      .catch((error) => {});
    setSummary('🎮 ' + gameName + ' 🎮');
    setStartTime(new Date());
    setEndTime(new Date());
    setDescription('');
    setEmail('');
    setEmails([]);
  };
  const handleAddEmail = () => {
    setEmails([...emails, {'email':email}]);
    setEmail('');
  };

  const handleDelete = (e) => () => {
    setEmails((emails) => emails.filter((singleEmail) => singleEmail.email !== e));
  };

  function isValidEmail(email) {
    if (email !== '' &&
    /[\w\d-]+@[\w\d-]+\.[\w\d-]+/.test(email)){
      let e;
      for (e of emails) {
        if (e.email === email) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  return (
    <div>
      <Button variant='contained'
        color='primary' onClick={handleClickOpen}>
        Add Game Event
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Summary"
            value={summary}
            onChange={(e)=> setSummary(e.target.value)}
            fullWidth
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DateTimePicker
            label="Start Time"
            value={startTime}
            onChange={setStartTime}
            className={classes.textField}
            showTodayButton
            disablePast
          />
          <DateTimePicker
            label="End Time"
            value={endTime}
            onChange={setEndTime}
            className={classes.textField}
            showTodayButton
            disablePast
          />
          </MuiPickersUtilsProvider>
          <TextField
            autoFocus
            margin="dense"
            label="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            label="Add Attendees Email and press Enter"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isValidEmail(email)) {
                handleAddEmail(e);
              }
            }}
            fullWidth
          />
          <Paper component="ul" className={classes.emails}>
            {emails.map((e, index) => {
              return (
                <li key={index}>
                  <Chip
                    label={e.email}
                    onDelete={handleDelete(e.email)}
                    className={classes.chip}
                  />
                </li>
              );
            })}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

CreateEventButton.propTypes = {
  gameName: PropTypes.string,
  gameId: PropTypes.string,
  createRoomLink: PropTypes.func,
  deleteRoom: PropTypes.func,
};
