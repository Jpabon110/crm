import QueryString from 'query-string';
import { requests } from '../helper/Agent';

export default class Users {
  static get(query) {
    return requests.get(`/contacts?${QueryString.stringify(query)}`);
  }

  static getById(id) {
    return requests.get(`/contacts/${id}`);
  }

  static getByRut(rut) {
    return requests.get(`/contacts/RUT/${rut}`);
  }

  static getContractByRut(rut) {
    return requests.get(`/contacts/RUT/${rut}/contracts?page=1&limit=10`);
  }

  static create(data) {
    return requests.post('/contacts', data);
  }

  static update(id, data) {
    return requests.put(`/contacts/${id}`, data);
  }

  static removeById(id) {
    return requests.del(`/contacts/${id}`);
  }
}
