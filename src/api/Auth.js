import { requests, setToken } from '../helper/Agent';

export default class Auth {
  static signIn(data) {
    return requests.post('/sign-in', data);
  }

  static setToken(token) {
    setToken(token);
  }

  static signOut() {
    return requests.post('/sign-out');
  }

  static restPassword(body) {
    return requests.post('/recover-password', body);
  }
}
