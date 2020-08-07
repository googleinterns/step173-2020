import {SET_CURRENT_USER} from '../types';

export default function(state = {}, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return action.payload;
        default:
            return state;
    }
}