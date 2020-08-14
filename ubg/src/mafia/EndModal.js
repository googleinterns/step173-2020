import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const useStyles = makeStyles((theme) => ({
  fonts: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
}));

/**
 * @param {string} winMessage String that shows who won
 * @param {array} usersData Array of player objects
 * @return {ReactElement} End result modal
 */
function EndModal({winMessage, usersData}) {
  const classes = useStyles();

  return (
    <div>
      <Typography variant='h4' className={classes.fonts}>
        {winMessage}
      </Typography>
      <br />
      {
        usersData.map((player) => {
          let roleString = null;
          switch (player.role) {
            case 1:
              roleString = 'villager';
              break;
            case 2:
              roleString = 'mafia';
              break;
            case 3:
              roleString = 'detective';
              break;
            case 4:
              roleString = 'doctor';
              break;
            default:
              roleString = 'invalid';
          }
          return (
            <div key={player.uid}>
              <Typography variant="body1">
                {player.displayName}: {roleString}
              </Typography>
              <br />
            </div>
          );
        })
      }
    </div>
  );
}

EndModal.propTypes = {
  usersData: PropTypes.array,
  winMessage: PropTypes.string,
};

const mapStateToProps = (state) => ({
  usersData: state.usersData,
});

export default connect(
    mapStateToProps,
    {},
)(EndModal);
