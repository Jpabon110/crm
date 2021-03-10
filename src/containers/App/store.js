import { combineReducers, createStore, applyMiddleware } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  sidebarReducer,
  themeReducer,
  topbarReducer,
  contactReducer,
  userReducer,
  caseReducer,
  quotationsReducer,
  resourcesReducer,
  emailTemaplateReducer,
} from '../../redux/reducers/index';

const reducer = combineReducers({
  form: reduxFormReducer, // mounted under "form",
  theme: themeReducer,
  sidebar: sidebarReducer,
  topbar: topbarReducer,
  contacts: contactReducer,
  users: userReducer,
  cases: caseReducer,
  quotations: quotationsReducer,
  resources: resourcesReducer,
  emailTemplate: emailTemaplateReducer,
});

// const store = createStore(reducer);
const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk)),
);


export default store;
