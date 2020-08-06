import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  fonts: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

/**
 * @param {object} usersData User collection data
 * @param {object} usersCollection Users collection
 * @param {func} startGame Updates the game to start
 * @return {ReactElement} Mafia modal element
 */
export default function Settings({usersData, usersCollection, startGame}) {
  const classes = useStyles();
  //  const minPlayers = 4;  for when we have enough players
  const users = [];
  let cutoff = 0;
  let prevCutoff = 0;
  const [villager, setVillager] = useState(usersData.length);
  const [mafia, setMafia] = useState(0);
  const [detective, setDetective] = useState(0);
  const [doctor, setDoctor] = useState(0);
  const [disabled, setDisabled] = useState(false);

  /**
   * Retrieves users from db in random ordering, assigns roles, and starts game
   * @param {*} event
   */
  function assignRoles(event) {
    event.preventDefault();

    // order by order property assigned upon joining room
    usersCollection.orderBy('order')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((user) => {
            users.push(user.data().uid);
          });
        })
        .then(() => {
          assignRole(villager, 1);
          assignRole(mafia, 2);
          assignRole(detective, 3);
          assignRole(doctor, 4);
          startGame();
        });
  }

  /**
   * Assigns individual role
   * @param {string} role Current role being assigned
   * @param {number} roleNum Assigned number to current role
   */
  function assignRole(role, roleNum) {
    for (let i = cutoff; i < parseInt(role) + prevCutoff; i++) {
      usersCollection.doc(users[i]).update({
        role: roleNum,
      });
      cutoff++;
    };
    prevCutoff = cutoff;
  }

  useEffect(() => {
    setDisabled(
        (usersData.length !== parseInt(villager) + parseInt(mafia) +
      parseInt(detective) + parseInt(doctor)),
        //  ||  for when we have enough players
        //  (usersData.length < minPlayers) ||
        //  (parseInt(villager) < 1) ||
        //  (parseInt(mafia) < 1)
    );
  }, [villager, mafia, detective, doctor, usersData.length]);

  return (
    <div>
      <Typography variant='h4' className={classes.fonts}>
        SETTINGS
      </Typography>
      <br />
      <Typography variant='body1'>
        Number of players: {usersData.length}
      </Typography>
      <br />
      <form onSubmit={assignRoles}>
        <FormControl className={classes.formControl}>
          <TextField
            id="villager-text"
            label="Villagers"
            variant="outlined"
            type='number'
            defaultValue={villager}
            onChange={(event) => setVillager(event.target.value)}
            required
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            id="mafia-text"
            label="Mafia"
            variant="outlined"
            type='number'
            defaultValue={mafia}
            onChange={(event) => (setMafia(event.target.value))}
            required
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            id="detective-text"
            label="Detective"
            variant="outlined"
            type='number'
            defaultValue={detective}
            onChange={(event) => (setDetective(event.target.value))}
            required
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            id="doctor-text"
            label="Doctor"
            variant="outlined"
            type='number'
            defaultValue={doctor}
            onChange={(event) => (setDoctor(event.target.value))}
            required
          />
        </FormControl>
        <br /> <br />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={disabled}
        >
          Start Game
        </Button>
      </form>
    </div>
  );
}

Settings.propTypes = {
  usersData: PropTypes.object,
  usersCollection: PropTypes.object,
  startGame: PropTypes.func,
};
