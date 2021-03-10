import QueryString from 'query-string';
import { requests } from '../helper/Agent';

export default class Quotations {
  static getQuotationDataExport(query) {
    return requests.get(`/quotations/export-data?${QueryString.stringify(query)}`);
  }

  static getAllQuotations(query) {
    return requests.get(`/quotations?${QueryString.stringify(query)}`);
  }

  static getAllQuotationsDashboard(query) {
    return requests.get(`/quotations/dashboard?${QueryString.stringify(query)}`);
  }

  static getAllQuotationsMe(query) {
    return requests.get(`/quotations/me?${QueryString.stringify(query)}`);
  }

  static createQuotations(data) {
    return requests.post('/quotations', data);
  }

  static sendFormRequest(data) {
    return requests.post('/send-info-request', data);
  }

  static createQuotationsMe(data) {
    return requests.post('/quotations/me', data);
  }

  static getQuotatioSummary(query) {
    return requests.get(`/quotations/summary?${QueryString.stringify(query)}`);
  }

  static getQuotationById(id) {
    return requests.get(`/quotations/${id}`);
  }

  static getQuotationByIdMe(id) {
    return requests.get(`/quotations/me/${id}`);
  }

  static updateQuotations(id, data) {
    return requests.put(`/quotations/${id}`, data);
  }

  static updateQuotationMany(data) {
    return requests.put('/quotations/', data);
  }

  static updateQuotationsMe(id, data) {
    return requests.put(`/quotations/me/${id}`, data);
  }

  static removeQuotationsById(id) {
    return requests.del(`/quotations/${id}`);
  }
}
