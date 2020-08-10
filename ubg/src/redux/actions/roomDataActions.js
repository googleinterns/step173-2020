import {SET_ROOM_DATA} from '../types';

export const setRoomData = roomData => dispatch => {
  dispatch({type: SET_ROOM_DATA, payload: roomData});
};