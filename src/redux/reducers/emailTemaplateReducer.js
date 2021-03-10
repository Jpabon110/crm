/* eslint-disable max-len */
import {
  CREATE_EMAIL_TEMPLATE,
  CREATE_EMAIL_TEMPLATE_SUCCESS,
  CREATE_EMAIL_TEMPLATE_FAILED,
  GET_EMAIL_TEMPLATE,
  GET_EMAIL_TEMPLATE_SUCCESS,
  GET_EMAIL_TEMPLATE_FAILED,
  GET_EMAIL_TEMPLATE_ID,
  GET_EMAIL_TEMPLATE_ID_SUCCESS,
  GET_EMAIL_TEMPLATE_ID_FAILED,
  UPDATE_EMAIL_TEMPLATE,
  UPDATE_EMAIL_TEMPLATE_SUCCESS,
  UPDATE_EMAIL_TEMPLATE_FAILED,
  DELETE_EMAIL_TEMPLATE,
  DELETE_EMAIL_TEMPLATE_SUCCESS,
  DELETE_EMAIL_TEMPLATE_FAILED,
} from '../../api/Types';

const initState = {
  collection: [],
  count: 0,
  limit: 10,
  loadingEmailTemplatesById: false,
  allEmailTemplates: [],
  loadingReasing: false,
  emailTemplateInfo: {
    title: '',
    body: '',
  },
};

export default (state = initState, action) => {
  switch (action.type) {
    case CREATE_EMAIL_TEMPLATE:
      return { ...state, loadingTemplate: true };
    case CREATE_EMAIL_TEMPLATE_SUCCESS:
      return {
        ...state,
        loadingTemplate: false,
        emailTemplate: action.payload.emailTemplate,
      };
    case CREATE_EMAIL_TEMPLATE_FAILED:
      return { ...state, loadingTemplate: false, error: action.error };
    case GET_EMAIL_TEMPLATE:
      return { ...state, loadingAllTemplates: true };
    case GET_EMAIL_TEMPLATE_SUCCESS:
      return {
        ...state,
        loadingAllTemplates: false,
        allEmailTemplates: action.payload.allEmailTemplates,
        countEmailTemplates: action.payload.countEmailTemplates,
        limitEmailTemplates: action.payload.limitEmailTemplates,
      };
    case GET_EMAIL_TEMPLATE_FAILED:
      return { ...state, loadingAllTemplates: false, error: action.payload.error };
    case GET_EMAIL_TEMPLATE_ID:
      return { ...state, loadingEmailTemplatesById: true };
    case GET_EMAIL_TEMPLATE_ID_SUCCESS:
      return {
        ...state,
        loadingEmailTemplatesById: false,
        emailTemplateInfo: action.payload.emailTemplateInfo,
      };
    case GET_EMAIL_TEMPLATE_ID_FAILED:
      return { ...state, loadingEmailTemplatesById: false, error: action.payload.error };
    case UPDATE_EMAIL_TEMPLATE:
      return { ...state, loadingUpdateTemplate: true };
    case UPDATE_EMAIL_TEMPLATE_SUCCESS:
      return {
        ...state,
        loadingUpdateTemplate: false,
      };
    case UPDATE_EMAIL_TEMPLATE_FAILED:
      return { ...state, loadingUpdateTemplate: false, error: action.error };
    case DELETE_EMAIL_TEMPLATE:
      return { ...state, loadingDelete: true };
    case DELETE_EMAIL_TEMPLATE_SUCCESS:
      return { ...state, loadingDelete: false };
    case DELETE_EMAIL_TEMPLATE_FAILED:
      return { ...state, loadingDelete: false, error: action.payload.error };
    default:
      return state;
  }
};
