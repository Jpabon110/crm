/* eslint-disable no-restricted-globals */
import Auth from '../api/Auth';

const closeSesion = () => {
  Auth.signOut();
  localStorage.clear();
  location.href = '/';
};

export default closeSesion;
