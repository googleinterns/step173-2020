import {SET_CURRENT_USER} from '../types';

/**
 * Returns state of current user
 * @param {obj} state current user state
 * @param {obj} action action object
 * @return {obj} changed state
 */
export default function(state = {}, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return action.payload;
    default:
      return state;
  }
}
