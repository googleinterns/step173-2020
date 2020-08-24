import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import PropTypes from 'prop-types';
import {useHistory} from 'react-router-dom';

/**
 * @return {ReactElement} ExitDialog element
 */
export default function ExitDialog({leaveRoom, setExit}) {
  const [open, setOpen] = React.useState(true);
  const history = useHistory();

  const handleStay = () => {
    setOpen(false);
    setExit(null);
  };

  const handleExit = () => {
    setOpen(false);
    leaveRoom();
    history.push('/');
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleStay}
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to leave the game?
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

ExitDialog.propTypes = {
  leaveRoom: PropTypes.func,
  setExit: PropTypes.func,
};
