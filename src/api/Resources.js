import QueryString from 'query-string';
import { requests } from '../helper/Agent';

export default class Resources {
  static getRegions() {
    return requests.get('/regions');
  }

  static getRoles() {
    return requests.get('/roles');
  }

  static getSexes() {
    return requests.get('/sexes');
  }

  static getNationalities() {
    return requests.get('/nationalities');
  }

  static getCivilStatus() {
    return requests.get('/civil-status');
  }

  static getRegionById(id) {
    return requests.get(`/regions/${id}`);
  }

  static getCommuns(query) {
    return requests.get(`/communs?${QueryString.stringify(query)}`);
  }

  static getCommunById(id) {
    return requests.get(`/communs/${id}`);
  }

  static getSettings() {
    return requests.get('/settings');
  }

  static getSettingsUrlCustomerService() {
    return requests.get('/settings/gmail-auth-url/customerService');
  }

  static getSettingsUrlPrePaid() {
    return requests.get('/settings/gmail-auth-url/prepaid');
  }

  static getSettingsUrlPrePaidInternal() {
    return requests.get('/settings/gmail-auth-url/prepaidInternal');
  }

  static updateSettingsPrePaid(id, data) {
    return requests.put(`/settings/${id}`, data);
  }

  static getNotifications() {
    return requests.get('/notifications/me?all=true&readed=false');
  }
}
