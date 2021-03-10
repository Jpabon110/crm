import QueryString from 'query-string';
import { requests } from '../helper/Agent';

const FOLDER = 'autofin/cmr/avatar';

export default class Users {
  static get(query) {
    return requests.get(`/users?${QueryString.stringify(query)}`);
  }

  static getById(id) {
    return requests.get(`/users/${id}`);
  }

  static create(data) {
    return requests.post('/users', data);
  }

  static update(id, data) {
    return requests.put(`/users/${id}`, data);
  }

  static delete(id) {
    return requests.del(`/users/${id}`);
  }

  static getSignature(filename) {
    return requests.get(`/signature?folder=${FOLDER}&public_id=${filename}`);
  }

  static uploadAvatar(params) {
    return requests.uploadToCloudinary({
      apiKey: params.apiKey,
      file: params.file,
      folder: FOLDER,
      public_id: params.file.name,
      signature: params.signature,
      timestamp: params.timestamp,
    });
  }

  static getMe() {
    return requests.get('/users/me');
  }

  static updateMe(data) {
    return requests.put('/users/me', data);
  }


  static updateMePassword(data) {
    return requests.put('/users/me/password', data);
  }
}
