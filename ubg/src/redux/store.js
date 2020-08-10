import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers
} from 'redux';
import thunk from 'redux-thunk';
import currentUserReducer from './reducers/currentUserReducer';
import roomDataReducer from './reducers/roomDataReducer';
import usersDataReducer from './reducers/usersDataReducer';

const allReducers = combineReducers({
  currentUser: currentUserReducer,
  roomData: roomDataReducer,
  usersData: usersDataReducer,
});

const store = createStore(
  allReducers,
  {},
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;