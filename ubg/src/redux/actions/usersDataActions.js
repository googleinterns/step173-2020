import {SET_USERS_DATA} from '../types';

export const setUsersData = usersData => dispatch => {
    dispatch({type: SET_USERS_DATA, payload: usersData});
};