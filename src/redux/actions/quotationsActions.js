/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-console */
import map from 'lodash/map';
import Quotations from '../../api/Quotations';
import BasicNotification from '../../shared/components/Notifications/BasicNotification';
import closeSesion from '../../helper/functions';
import {
  GET_ALL_QUOTATIONS,
  GET_ALL_QUOTATIONS_SUCCESS,
  GET_ALL_QUOTATIONS_FAILED,
  GET_ALL_QUOTATIONS_DASHBOARD,
  GET_ALL_QUOTATIONS_DASHBOARD_SUCCESS,
  GET_ALL_QUOTATIONS_DASHBOARD_FAILED,
  CREATE_QUOTATIONS,
  CREATE_QUOTATIONS_SUCCESS,
  CREATE_QUOTATIONS_FAILED,
  GET_QUOTATIONS_ID,
  GET_QUOTATIONS_ID_SUCCESS,
  GET_QUOTATIONS_ID_FAILED,
  UPDATE_QUOTATIONS,
  UPDATE_QUOTATIONS_SUCCESS,
  UPDATE_QUOTATIONS_FAILED,
  UPDATE_QUOTATION_MANY,
  UPDATE_QUOTATION_MANY_SUCCESS,
  UPDATE_QUOTATION_MANY_FAILED,
  DELETE_QUOTATIONS,
  DELETE_QUOTATIONS_SUCCESS,
  DELETE_QUOTATIONS_FAILED,
  SEND_FORM,
  SEND_FORM_SUCCESS,
  SEND_FORM_FAILED,
  GET_SUMMARY_QUOTATIONS,
  GET_SUMMARY_QUOTATIONS_SUCCESS,
  GET_SUMMARY_QUOTATIONS_FAILED,
} from '../../api/Types';

export const getQuotationDataExport = (data, cb) => async () => {
  try {
    const { body } = await Quotations.getQuotationDataExport(data);
    if (cb) {
      cb(body);
    }
  } catch (error) {
    console.error(error);
    BasicNotification.error('Ocurrió un error al intentar obtener la data a exportar.');
  }
};

export const getQuotationsSummary = (query, cb) => async (dispatch) => {
  dispatch({ type: GET_SUMMARY_QUOTATIONS, loadingQuotationsSummary: true });
  try {
    const { body } = await Quotations.getQuotatioSummary(query);
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_SUMMARY_QUOTATIONS_SUCCESS, loadingQuotationsSummary: false, payload: { summary: body } });
  } catch (error) {
    dispatch({ type: GET_SUMMARY_QUOTATIONS_FAILED, loadingQuotationsSummary: false, payload: { error } });
    if (error.status === 403) {
      BasicNotification.error('No tienes permisos para ver los casos.');
    } else {
      console.error(error);
      BasicNotification.error('Ocurrió un error al intentar obtener el summary de cotizaciones.');
    }
  }
};

export const getAllQuotations = (query = {}, cb) => async (dispatch) => {
  dispatch({ type: GET_ALL_QUOTATIONS, cargando: true });
  try {
    const { body, header } = await Quotations.getAllQuotations(query);
    const countQuotations = header['x-pagination-total-count'];
    const limitQuotations = header['x-pagination-limit'];
    if (cb) {
      cb(body);
    }
    dispatch({
      type: GET_ALL_QUOTATIONS_SUCCESS,
      payload: { allQuotations: body, countQuotations, limitQuotations },
    });
  } catch (error) {
    dispatch({ type: GET_ALL_QUOTATIONS_FAILED, cargando: false, payload: { error } });
    if (error.status === 401) {
      console.error(error);
      closeSesion();
    }
  }
};


export const getAllQuotationsDashboard = (query = {}, cb) => async (dispatch) => {
  dispatch({ type: GET_ALL_QUOTATIONS_DASHBOARD });
  try {
    const { body } = await Quotations.getAllQuotationsDashboard(query);
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_ALL_QUOTATIONS_DASHBOARD_SUCCESS, payload: body });
  } catch (error) {
    dispatch({ type: GET_ALL_QUOTATIONS_DASHBOARD_FAILED, payload: { error } });
    if (error.status === 401) {
      console.error(error);
      closeSesion();
    }
  }
};

export const getAllQuotationsMe = (query = {}, cb) => async (dispatch) => {
  dispatch({ type: GET_ALL_QUOTATIONS, cargando: true });
  try {
    const { body, header } = await Quotations.getAllQuotationsMe(query);
    const countQuotations = header['x-pagination-total-count'];
    const limitQuotations = header['x-pagination-limit'];
    if (cb) {
      cb(body);
    }
    dispatch({
      type: GET_ALL_QUOTATIONS_SUCCESS,
      payload: { allQuotations: body, countQuotations, limitQuotations },
    });
  } catch (error) {
    dispatch({ type: GET_ALL_QUOTATIONS_FAILED, cargando: false, payload: { error } });
    if (error.status === 401) {
      console.error(error);
      closeSesion();
    }
  }
};

export const getQuotationById = (id, cb) => async (dispatch) => {
  dispatch({ type: GET_QUOTATIONS_ID, loadingQuotations: true });
  try {
    const { body } = await Quotations.getQuotationById(id);
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_QUOTATIONS_ID_SUCCESS, loadingQuotations: false, payload: { quotationInfo: body } });
  } catch (error) {
    dispatch({ type: GET_QUOTATIONS_ID_FAILED, loadingQuotations: false, payload: { error } });
    if (error.status === 403) {
      BasicNotification.error('No tienes permisos para ver la cotización selccionado.');
    } else {
      console.error(error);
      BasicNotification.error('Ocurrió un error al intentar obtener los datos de la cotización');
    }
  }
};

export const getQuotationByIdMe = (id, cb) => async (dispatch) => {
  dispatch({ type: GET_QUOTATIONS_ID, loadingQuotations: true });
  try {
    const { body } = await Quotations.getQuotationByIdMe(id);
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_QUOTATIONS_ID_SUCCESS, loadingQuotations: false, payload: { quotationInfo: body } });
  } catch (error) {
    dispatch({ type: GET_QUOTATIONS_ID_FAILED, loadingQuotations: false, payload: { error } });
    if (error.status === 403) {
      BasicNotification.error('No tienes permisos para ver la cotización selccionado.');
    } else {
      console.error(error);
      BasicNotification.error('Ocurrió un error al intentar obtener los datos de la cotización');
    }
  }
};

export const updateQuotationMany = (data, cb) => async (dispatch) => {
  dispatch({ type: UPDATE_QUOTATION_MANY, cargando: true });
  BasicNotification.info('Reasignando Cotizaciones...');
  try {
    await Quotations.updateQuotationMany(data);
    if (cb) {
      cb();
    }
    dispatch({ type: UPDATE_QUOTATION_MANY_SUCCESS, cargando: false });
    BasicNotification.success('Cotizaciones reasignadas con éxito.');
  } catch (error) {
    console.error(error);
    dispatch({ type: UPDATE_QUOTATION_MANY_FAILED, cargando: false, payload: { error } });
    BasicNotification.error('Ocurrió un error al intentar reasignar Cotizaciones');
  }
};

export const updateQuotations = (id, data, cb) => async (dispatch) => {
  dispatch({ type: UPDATE_QUOTATIONS, cargando: true });
  if ((data.action === 'sendToTrinidad')) {
    BasicNotification.info('Enviando evaluación...');
  } else {
    BasicNotification.info('Actualizando cotización...');
  }
  try {
    if (data.action === 'addMessage') {
      const formData = new FormData();
      formData.append('action', data.action);
      formData.append('body', data.body);
      if (data.attachments) {
        map(data.attachments, (file) => {
          formData.append('attachments', file);
        });
      }
      data = formData;
    }
    await Quotations.updateQuotations(id, data);
    if (cb) {
      cb();
    }
    dispatch({ type: UPDATE_QUOTATIONS_SUCCESS, cargando: false });
    if ((data.action === 'sendToTrinidad')) {
      BasicNotification.success('Evaluación enviada con éxito.');
    } else {
      BasicNotification.success('Cotización actualizada con éxito.');
    }
  } catch (error) {
    console.error(error);
    if (error.status === 401) { closeSesion(); }
    if (error.status === 400 && error.response.body.code === 'CaseIsClosed') {
      dispatch({ type: UPDATE_QUOTATIONS_FAILED, cargando: false, payload: { error } });
      BasicNotification.error('No es posible agregar actividades a una cotización cerrado.');
    }
    if (error.status === 400 && error.response.body.code === 'QuotationAlreadySentTrinidad') {
      dispatch({ type: UPDATE_QUOTATIONS_FAILED, cargando: false, payload: { error } });
      BasicNotification.error('Ya fue enviada la evaluacion.');
    }
    if (error.status === 400 && error.response.body.code === 'MissingFieldsToSend') {
      dispatch({ type: UPDATE_QUOTATIONS_FAILED, cargando: false, payload: { error } });
      BasicNotification.error('Se necesitan los campos de situación laboral, tipo de vehiculo y renta para realizar la evaluación.');
    }
    if (error.status === 400 && error.response.body.code === 'MissingClientFieldsToSend') {
      dispatch({ type: UPDATE_QUOTATIONS_FAILED, cargando: false, payload: { error } });
      BasicNotification.error('Se necesitan los campos de correo y telefono del cliete para realizar la evaluación.');
    }
    if (error.status === 400 && error.response.body.code === 'ErrorTrinidad') {
      dispatch({ type: UPDATE_QUOTATIONS_FAILED, cargando: false, payload: { error } });
      BasicNotification.error('Error al intentar evaluar al cliente (error trinidad).');
    }
  }
};

export const updateQuotationsMe = (id, data, cb) => async (dispatch) => {
  dispatch({ type: UPDATE_QUOTATIONS, cargando: true });
  BasicNotification.info('Actualizando cotización...');
  try {
    if (data.action === 'addMessage') {
      const formData = new FormData();
      formData.append('action', data.action);
      formData.append('body', data.body);
      if (data.attachments) {
        map(data.attachments, (file) => {
          formData.append('attachments', file);
        });
      }
      data = formData;
    }
    await Quotations.updateQuotationsMe(id, data);
    if (cb) {
      cb();
    }
    dispatch({ type: UPDATE_QUOTATIONS_SUCCESS, cargando: false });
    BasicNotification.success('Cotizacion actualizada con éxito.');
  } catch (error) {
    console.error(error);
    if (error.status === 401) { closeSesion(); }
    if (error.status === 400 && error.response.body.code === 'CaseIsClosed') {
      dispatch({ type: UPDATE_QUOTATIONS_FAILED, cargando: false, payload: { error } });
      BasicNotification.error('No es posible agregar actividades a una cotización cerrado.');
    }
    if (error.status === 400 && error.response.body.code === 'ErrorTrinidad') {
      dispatch({ type: UPDATE_QUOTATIONS_FAILED, cargando: false, payload: { error } });
      BasicNotification.error('Error al intentar evaluar al cliente (error trinidad).');
    }
  }
};


export const deleteQuotations = (id, cb) => async (dispatch) => {
  dispatch({ type: DELETE_QUOTATIONS });
  BasicNotification.info('Eliminado Cotización...');
  try {
    await Quotations.removeQuotationsById(id);
    if (cb) {
      cb();
    }
    dispatch({ type: DELETE_QUOTATIONS_SUCCESS });
    BasicNotification.success('Cotización eliminada con éxito.');
  } catch (error) {
    dispatch({ type: DELETE_QUOTATIONS_FAILED });
    console.error(error);
    BasicNotification.error('Ocurrió un error al intentar eliminar la Cotización');
  }
};

export const createQuotations = (data, cb) => async (dispatch) => {
  dispatch({ type: CREATE_QUOTATIONS, loadingCreateQ: true });
  // console.log(data);
  try {
    BasicNotification.info('Creando cotización...');
    const { body } = await Quotations.createQuotations(data);
    if (cb) {
      cb(body);
    }
    dispatch({ type: CREATE_QUOTATIONS_SUCCESS, payload: { quotation: body }, loadingCreateQ: false });
    BasicNotification.success('Cotización creada con éxito.');
  } catch (error) {
    console.error(error);
    if (error.status === 401) { closeSesion(); } else {
      BasicNotification.error('Ocurrió un error al intentar crear la cotización.');
    }
    dispatch({ type: CREATE_QUOTATIONS_FAILED, error, loadingCreateQ: false });
  }
};


export const sendFormRequest = (data, cb) => async (dispatch) => {
  dispatch({ type: SEND_FORM, loadingSendForm: true });
  // console.log(data);
  try {
    BasicNotification.info('Enviado formulario...');
    const { body } = await Quotations.sendFormRequest(data);
    if (cb) {
      cb(body);
    }
    dispatch({ type: SEND_FORM_SUCCESS, payload: { SendedForm: body }, loadingSendForm: false });
    BasicNotification.success('Formulario enviado con éxito.');
  } catch (error) {
    dispatch({ type: SEND_FORM_FAILED, error, loadingSendForm: false });
    BasicNotification.success('Error al tratar de enviar el formulario.');
    console.error(error);
    if (error.status === 401) { closeSesion(); }
  }
};

export const createQuotationsMe = (data, cb) => async (dispatch) => {
  dispatch({ type: CREATE_QUOTATIONS, loadingCreateQ: true });
  // console.log(data);
  try {
    BasicNotification.info('Creando cotización...');
    const { body } = await Quotations.createQuotationsMe(data);
    if (cb) {
      cb(body);
    }
    dispatch({ type: CREATE_QUOTATIONS_SUCCESS, payload: { quotation: body }, loadingCreateQ: false });
    BasicNotification.success('Cotización creada con éxito.');
  } catch (error) {
    console.error(error);
    if (error.status === 401) { closeSesion(); }
    // if (error.status === 409 && error.response.body.code === 'EmailAlreadyExists') {
    //   BasicNotification.error('El email ingresado ya está registrado en el sistema.');
    // } else if (error.status === 409 && error.response.body.code === 'RUTAlreadyExists') {
    //   BasicNotification.error('El rut ingresado ya está registrado en el sistema.');
    // } else {
    //   BasicNotification.error('Ocurrió un error al intentar crear el usuario');
    // }
    dispatch({ type: CREATE_QUOTATIONS_FAILED, error, loadingCreateQ: false });
  }
};
