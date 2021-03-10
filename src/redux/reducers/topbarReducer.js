import {
  SET_TITLE,
} from '../actions/topbarActions';

const initialState = {
  title: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_TITLE:
      return { ...state, title: action.payload.title };
    default:
      return state;
  }
}
