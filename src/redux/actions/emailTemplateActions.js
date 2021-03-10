/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
// import map from 'lodash/map';
import EmailTemplate from '../../api/EmailTemplate';
import BasicNotification from '../../shared/components/Notifications/BasicNotification';
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

export const createEmailTemplate = (data, cb) => async (dispatch) => {
  dispatch({ type: CREATE_EMAIL_TEMPLATE, loadingTemplate: true });
  try {
    BasicNotification.info('Creando plantillas...');
    const { body } = await EmailTemplate.createEmailTemplate(data);
    if (cb) {
      cb(body);
    }
    dispatch({ type: CREATE_EMAIL_TEMPLATE_SUCCESS, loadingTemplate: false, payload: { emailTemplate: body } });
    BasicNotification.success('Plantilla creado con éxito.');
  } catch (error) {
    console.error(error);
    if (error.status === 404) {
      BasicNotification.error('El template no pudo ser ingresado, error en la api.');
    } else {
      BasicNotification.error('Ocurrió un error al intentar crear el plantilla.');
    }
    dispatch({ type: CREATE_EMAIL_TEMPLATE_FAILED, loadingTemplate: false, error });
  }
};


export const getAllEmailTemplates = (query = {}, cb) => async (dispatch) => {
  dispatch({ type: GET_EMAIL_TEMPLATE, loadingAllTemplates: true });
  try {
    const { body, header } = await EmailTemplate.getAllEmailTemplates(query);
    const countEmailTemplates = header['x-pagination-total-count'];
    const limitEmailTemplates = header['x-pagination-limit'];

    if (cb) {
      cb(body);
    }
    dispatch({
      type: GET_EMAIL_TEMPLATE_SUCCESS,
      loadingAllTemplates: false,
      payload: { allEmailTemplates: body, countEmailTemplates, limitEmailTemplates },
    });
  } catch (error) {
    dispatch({ type: GET_EMAIL_TEMPLATE_FAILED, loadingAllTemplates: false, payload: { error } });
    if (error.status === 403) {
      BasicNotification.error('No tienes permisos para ver los plantillas.');
    } else {
      console.error(error);
      BasicNotification.error('Ocurrió un error al intentar obtener los plantillas');
    }
  }
};

export const getEmailTemplateById = (id, cb) => async (dispatch) => {
  dispatch({ type: GET_EMAIL_TEMPLATE_ID, loadingEmailTemplatesById: true });
  try {
    const { body } = await EmailTemplate.getEmailTemplateById(id);
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_EMAIL_TEMPLATE_ID_SUCCESS, loadingEmailTemplatesById: false, payload: { emailTemplateInfo: body } });
  } catch (error) {
    dispatch({ type: GET_EMAIL_TEMPLATE_ID_FAILED, loadingEmailTemplatesById: false, payload: { error } });
    if (error.status === 403) {
      BasicNotification.error('No tienes permisos para ver la plantillas.');
    } else {
      console.error(error);
      BasicNotification.error('Ocurrió un error al intentar obtener la plantillas');
    }
  }
};

export const updateEmailTemplate = (id, data, cb) => async (dispatch) => {
  dispatch({ type: UPDATE_EMAIL_TEMPLATE, loadingUpdateTemplate: true });
  BasicNotification.info('Actualizando template...');
  try {
    await EmailTemplate.updateEmailTemplate(id, data);
    if (cb) {
      cb();
    }
    dispatch({ type: UPDATE_EMAIL_TEMPLATE_SUCCESS, loadingUpdateTemplate: false });
    BasicNotification.success('Plantilla actualizado con éxito.');
  } catch (error) {
    console.error(error);
    dispatch({ type: UPDATE_EMAIL_TEMPLATE_FAILED, loadingUpdateTemplate: false, payload: { error } });
    BasicNotification.error('Ocurrió un error al intentar editar el plantilla.');
  }
};

export const removeEmailTemplateById = (id, cb) => async (dispatch) => {
  dispatch({ type: DELETE_EMAIL_TEMPLATE });
  BasicNotification.info('Eliminado plantilla...');
  try {
    await EmailTemplate.removeEmailTemplateById(id);
    if (cb) {
      cb();
    }
    dispatch({ type: DELETE_EMAIL_TEMPLATE_SUCCESS });
    BasicNotification.success('Plantilla eliminado con éxito.');
  } catch (error) {
    dispatch({ type: DELETE_EMAIL_TEMPLATE_FAILED, payload: { error } });
    console.error(error);
    BasicNotification.error('Ocurrió un error al intentar eliminar el plantilla');
  }
};
