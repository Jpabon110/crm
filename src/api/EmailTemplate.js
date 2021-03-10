import QueryString from 'query-string';
import { requests } from '../helper/Agent';

export default class Users {
  static getAllEmailTemplates(query) {
    return requests.get(`/email-templates?${QueryString.stringify(query)}`);
  }

  static getEmailTemplateById(id) {
    return requests.get(`/email-templates/${id}`);
  }

  static createEmailTemplate(data) {
    return requests.post('/email-templates', data);
  }

  static updateEmailTemplate(id, data) {
    return requests.put(`/email-templates/${id}`, data);
  }

  static removeEmailTemplateById(id) {
    return requests.del(`/email-templates/${id}`);
  }
}
