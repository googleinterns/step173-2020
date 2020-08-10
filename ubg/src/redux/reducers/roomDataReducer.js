import {SET_ROOM_DATA} from '../types';

/**
 * Returns state of room data
 * @param {obj} state room data state
 * @param {obj} action action object
 * @return {obj} changed state
 */
export default function(state = {}, action) {
  switch (action.type) {
    case SET_ROOM_DATA:
      return action.payload;
    default:
      return state;
  }
}
