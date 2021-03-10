import QueryString from 'query-string';
import { requests } from '../helper/Agent';

export default class Case {
  static getCaseDataExport(query) {
    return requests.get(`/cases/export-data?${QueryString.stringify(query)}`);
  }

  static getAllTypesCases(query) {
    return requests.get(`/types-cases?${QueryString.stringify(query)}`);
  }

  static getAllSubTypesCases(query) {
    return requests.get(`/subtypes-cases?${QueryString.stringify(query)}`);
  }

  static getAllCases(query) {
    return requests.get(`/cases?${QueryString.stringify(query)}`);
  }

  static getAllCasesDashboard(query) {
    return requests.get(`/cases/dashboard?${QueryString.stringify(query)}`);
  }

  static getById(id) {
    return requests.get(`/contacts/${id}`);
  }

  static createCase(data) {
    return requests.post('/cases', data);
  }

  static createSubType(data) {
    return requests.post('/subtypes-cases', data);
  }

  static update(id, data) {
    return requests.put(`/contacts/${id}`, data);
  }

  static updateSubCase(id, data) {
    return requests.put(`/subtypes-cases/${id}`, data);
  }

  static getAllCasesMe(query) {
    return requests.get(`/cases/me?${QueryString.stringify(query)}`);
  }

  static createCaseMe(data) {
    return requests.post('/cases/me', data);
  }

  static getCaseByIdMe(id) {
    return requests.get(`/cases/me/${id}`);
  }

  static getCaseSummary() {
    return requests.get('/cases/summary');
  }

  static getCaseById(id) {
    return requests.get(`/cases/${id}`);
  }

  static updateCaseMe(id, data) {
    return requests.put(`/cases/me/${id}`, data);
  }

  static updateCase(id, data) {
    return requests.put(`/cases/${id}`, data);
  }

  static updateCaseMany(data) {
    return requests.put('/cases/', data);
  }

  static removeCaseById(id) {
    return requests.del(`/cases/${id}`);
  }

  static removeSubCaseById(id) {
    return requests.del(`/subtypes-cases/${id}`);
  }
}
