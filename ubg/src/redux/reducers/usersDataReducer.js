import {SET_USERS_DATA} from '../types';

/**
 * Returns state of users data
 * @param {obj} state users data state
 * @param {obj} action action object
 * @return {obj} changed state
 */
export default function(state = {}, action) {
  switch (action.type) {
    case SET_USERS_DATA:
      return action.payload;
    default:
      return state;
  }
}
