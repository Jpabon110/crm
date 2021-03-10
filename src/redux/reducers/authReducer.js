import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT,
  LOGOUT_SUCCESS,
  LOGOUT_FAILED,
  RECOVERY,
  RECOVERY_SUCCESS,
  RECOVERY_FAILED,
} from '../actions/authAction';

const initialState = {
  loading: false,
  tokens: {},
  error: '',
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, loading: true };
    case LOGIN_SUCCESS:
      return {
        ...state, loading: false, tokens: action.payload, redirect: true,
      };
    case LOGIN_FAILED:
      return { ...state, error: action.error };
    case LOGOUT:
      return { ...state, loading: true };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        tokens: '',
        redirect: true,
      };
    case LOGOUT_FAILED:
      return { ...state, error: action.error };
    case RECOVERY:
      return { ...state, loading: true };
    case RECOVERY_SUCCESS:
      return { ...state, loading: false };
    case RECOVERY_FAILED:
      return { ...state, error: action.error };
    default:
      return state;
  }
}
