import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import PropTypes from 'prop-types';
import {useHistory} from 'react-router-dom';
import {connect} from 'react-redux';

/**
 * @return {ReactElement} ExitDialog element
 */
function ExitDialog({leaveRoom, setExit, endGame, room, aliveNum, day,
  userUid, hostUid, usersData, role}) {
  const [open, setOpen] = React.useState(true);
  const history = useHistory();

  const handleStay = () => {
    setOpen(false);
    setExit(null);
  };

  const handleExit = async () => {
    if (day) {
      await room.update({
        aliveCount: aliveNum - 1,
      });
    }
    // must pass in resolve function
    await endGame(() => {});
    if (userUid === hostUid) {
      await room.update({
        host: usersData[0].uid,
      });
    }
    switch (role) {
      case 3:
        await room.update(
            {detectiveCheck: {uid: 'none', displayName: 'none'}},
        );
        break;
      case 4:
        await room.update(
            {doctorSave: {uid: 'none', displayName: 'none'}},
        );
        break;
      case 5:
        await room.update(
            {hunterKill: {uid: 'none', displayName: 'none', chose: false}},
        );
        break;
      default:
    }
    leaveRoom();
    history.push('/');
  };

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
  day: state.roomData.day,
  aliveNum: state.roomData.aliveCount,
  userUid: state.currentUser.uid,
  hostUid: state.roomData.host,
  usersData: state.usersData,
});

export default connect(
    mapStateToProps,
    {},
)(ExitDialog);
