import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
// import { useFirestoreCollection } from 'reactfire';

/**
 * @return {ReactElement} ExitDialog element
 */
function RestartDialog({setRestart, usersData, startGame, usersCollection}) {
  const [open, setOpen] = React.useState(true);

  const handleStay = () => {
    setOpen(false);
    setRestart(null);
  };

  const handleExit = async () => {
    await usersData.forEach((player) => {
      usersCollection.doc(player.uid).update({
        alive: true,
        chose: false,
        order: Math.floor(Math.random() * 20),
      });
    });
    await startGame();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleStay}
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to restart the game?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExit} color="primary">
            Yes
          </Button>
          <Button onClick={handleStay} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

RestartDialog.propTypes = {
  day: PropTypes.bool,
  leaveRoom: PropTypes.func,
  endGame: PropTypes.func,
  setExit: PropTypes.func,
  room: PropTypes.object,
  aliveNum: PropTypes.number,
  userUid: PropTypes.string,
  hostUid: PropTypes.string,
  usersData: PropTypes.array,
  role: PropTypes.number,
};

const mapStateToProps = (state) => ({
  usersData: state.usersData,
});

export default connect(
    mapStateToProps,
    {},
)(RestartDialog);
