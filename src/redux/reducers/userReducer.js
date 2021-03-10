/* eslint-disable max-len */
import {
  GET_USERS,
  GET_USER_SUCCESS,
  GET_USER_FAILED,
  GET_CURRENT_USER,
  GET_CURRENT_USER_SUCCESS,
  GET_CURRENT_USER_FAILED,
} from '../../api/Types';

const initial = {
  collection: [],
  cargando: false,
  currentUser: {
    firstName: '',
    lastName: '',
    avatar: '',
  },
};
export default (state = initial, action) => {
  switch (action.type) {
    case GET_CURRENT_USER:
      return { ...state, loadingCurrentUser: true };
    case GET_CURRENT_USER_SUCCESS:
      return {
        ...state,
        loadingCurrentUser: false,
        currentUser: action.payload.currentUser,
      };
    case GET_CURRENT_USER_FAILED:
      return { ...state, loadingCurrentUser: false, error: action.payload.error };
    case GET_USERS:
      return { ...state, cargando: true };
    case GET_USER_SUCCESS:
      return {
        ...state,
        cargando: false,
        collection: action.payload.users,
        total: action.payload.countUsers,
        limit: action.payload.limitUsers,
      };
    case GET_USER_FAILED:
    default:
      return state;
  }
};
