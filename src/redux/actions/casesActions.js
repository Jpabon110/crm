/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import map from 'lodash/map';
import Case from '../../api/Case';
import BasicNotification from '../../shared/components/Notifications/BasicNotification';
import {
  CREATE_CASE,
  CREATE_CASE_SUCCESS,
  CREATE_CASE_FAILED,
  GET_TYPES,
  GET_TYPES_SUCCESS,
  GET_TYPES_FAILED,
  GET_SUBTYPES,
  GET_SUBTYPES_SUCCESS,
  GET_SUBTYPES_FAILED,
  GET_ALL_CASE,
  GET_ALL_CASE_SUCCESS,
  GET_ALL_CASE_FAILED,
  GET_ALL_CASE_DASHBOARD,
  GET_ALL_CASE_DASHBOARD_SUCCESS,
  GET_ALL_CASE_DASHBOARD_FAILED,
  DELETE_CASE,
  DELETE_CASE_SUCCESS,
  DELETE_CASE_FAILED,
  GET_CASE_ID,
  GET_CASE_ID_SUCCESS,
  GET_CASE_ID_FAILED,
  UPDATE_CASE,
  UPDATE_CASE_SUCCESS,
  UPDATE_CASE_FAILED,
  UPDATE_CASE_MANY,
  UPDATE_CASE_MANY_SUCCESS,
  UPDATE_CASE_MANY_FAILED,
  CREATE_SUBCASE,
  CREATE_SUBCASE_SUCCESS,
  CREATE_SUBCASE_FAILED,
  UPDATE_SUBCASE,
  UPDATE_SUBCASE_SUCCESS,
  UPDATE_SUBCASE_FAILED,
  DELETE_SUBCASE,
  DELETE_SUBCASE_SUCCESS,
  DELETE_SUBCASE_FAILED,
  GET_SUMMARY_CASES,
  GET_SUMMARY_CASES_SUCCESS,
  GET_SUMMARY_CASES_FAILED,
} from '../../api/Types';

export const getCaseDataExport = (data, cb) => async () => {
  try {
    const { body } = await Case.getCaseDataExport(data);
    if (cb) {
      cb(body);
    }
  } catch (error) {
    console.error(error);
    BasicNotification.error('Ocurrió un error al intentar obtener la data a exportar.');
  }
};

export const getCaseSummary = cb => async (dispatch) => {
  dispatch({ type: GET_SUMMARY_CASES, loadingCasesSummary: true });
  try {
    const { body } = await Case.getCaseSummary();
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_SUMMARY_CASES_SUCCESS, loadingCasesSummary: false, payload: { summary: body } });
  } catch (error) {
    dispatch({ type: GET_SUMMARY_CASES_FAILED, loadingCasesSummary: false, payload: { error } });
    if (error.status === 403) {
      BasicNotification.error('No tienes permisos para ver los casos.');
    } else {
      console.error(error);
      BasicNotification.error('Ocurrió un error al intentar obtener el summary de casos.');
    }
  }
};


export const getCasesIdMe = (id, cb) => async (dispatch) => {
  dispatch({ type: GET_CASE_ID, loadingCases: true });
  try {
    const { body } = await Case.getCaseByIdMe(id);
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_CASE_ID_SUCCESS, loadingCases: false, payload: { caseInfo: body } });
  } catch (error) {
    dispatch({ type: GET_CASE_ID_FAILED, loadingCases: false, payload: { error } });
    if (error.status === 403) {
      BasicNotification.error('No tienes permisos para ver el caso selccionado.');
    } else {
      console.error(error);
      BasicNotification.error('Ocurrió un error al intentar obtener los datos del caso');
    }
  }
};

export const getCasesId = (id, cb) => async (dispatch) => {
  dispatch({ type: GET_CASE_ID, loadingCases: true });
  try {
    const { body } = await Case.getCaseById(id);
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_CASE_ID_SUCCESS, loadingCases: false, payload: { caseInfo: body } });
  } catch (error) {
    dispatch({ type: GET_CASE_ID_FAILED, loadingCases: false, payload: { error } });
    if (error.status === 403) {
      BasicNotification.error('No tienes permisos para ver el caso selccionado.');
    } else {
      console.error(error);
      BasicNotification.error('Ocurrió un error al intentar obtener los datos del caso');
    }
  }
};

export const getAllTypesCases = (query = { all: true }, cb) => async (dispatch) => {
  dispatch({ type: GET_TYPES, cargando: true });
  try {
    const { body } = await Case.getAllTypesCases(query);
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_TYPES_SUCCESS, payload: { typesCases: body } });
  } catch (error) {
    dispatch({ type: GET_TYPES_FAILED, cargando: false, payload: { error } });
    if (error.status !== 403) {
      console.error(error);
      BasicNotification.error('Ocurrió un error al intentar obtener los tipos de casos');
    }
  }
};

export const getAllCases = (query = {}, cb) => async (dispatch) => {
  dispatch({ type: GET_ALL_CASE, loadingCases: true });
  try {
    const { body, header } = await Case.getAllCases(query);
    const countCases = header['x-pagination-total-count'];
    const limitCases = header['x-pagination-limit'];
    // console.log('countCases', countCases);
    // console.log('limitCases', limitCases);
    if (cb) {
      cb(body);
    }
    dispatch({
      type: GET_ALL_CASE_SUCCESS,
      loadingCases: false,
      payload: { allCases: body, countCases, limitCases },
    });
  } catch (error) {
    dispatch({ type: GET_ALL_CASE_FAILED, loadingCases: false, payload: { error } });
    if (error.status === 403) {
      BasicNotification.error('No tienes permisos para ver los casos.');
    } else {
      console.error(error);
      BasicNotification.error('Ocurrió un error al intentar obtener los tipos de casos');
    }
  }
};

export const getAllCasesDashboard = (query = {}, cb) => async (dispatch) => {
  dispatch({ type: GET_ALL_CASE_DASHBOARD });
  try {
    const { body } = await Case.getAllCasesDashboard(query);
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_ALL_CASE_DASHBOARD_SUCCESS, payload: body });
  } catch (error) {
    dispatch({ type: GET_ALL_CASE_DASHBOARD_FAILED, payload: { error } });
    if (error.status === 403) {
      BasicNotification.error('No tienes permisos para ver los casos.');
    } else {
      console.error(error);
      BasicNotification.error('Ocurrió un error al intentar obtener los tipos de casos');
    }
  }
};

export const getAllCasesMe = (query = {}, cb) => async (dispatch) => {
  dispatch({ type: GET_ALL_CASE, loadingCases: true });
  try {
    const { body, header } = await Case.getAllCasesMe(query);
    const countCases = header['x-pagination-total-count'];
    const limitCases = header['x-pagination-limit'];
    if (cb) {
      cb(body);
    }
    dispatch({
      type: GET_ALL_CASE_SUCCESS,
      loadingCases: false,
      payload: { allCases: body, countCases, limitCases },
    });
  } catch (error) {
    dispatch({ type: GET_ALL_CASE_FAILED, loadingCases: false, payload: { error } });
    if (error.status === 403) {
      BasicNotification.error('No tienes permisos para ver los casos.');
    } else {
      console.error(error);
      BasicNotification.error('Ocurrió un error al intentar obtener los tipos de casos');
    }
  }
};

export const deleteCase = (id, cb) => async (dispatch) => {
  dispatch({ type: DELETE_CASE });
  BasicNotification.info('Eliminado caso...');
  try {
    await Case.removeCaseById(id);
    if (cb) {
      cb();
    }
    dispatch({ type: DELETE_CASE_SUCCESS });
    BasicNotification.success('Caso eliminado con éxito.');
  } catch (error) {
    dispatch({ type: DELETE_CASE_FAILED });
    console.error(error);
    BasicNotification.error('Ocurrió un error al intentar eliminar el caso');
  }
};

export const updateCaseMany = (data, cb) => async (dispatch) => {
  dispatch({ type: UPDATE_CASE_MANY, cargando: true });
  BasicNotification.info('Reasignando casos...');
  try {
    await Case.updateCaseMany(data);
    if (cb) {
      cb();
    }
    dispatch({ type: UPDATE_CASE_MANY_SUCCESS, cargando: false });
    BasicNotification.success('Casos reasignados con éxito.');
  } catch (error) {
    console.error(error);
    dispatch({ type: UPDATE_CASE_MANY_FAILED, cargando: false, payload: { error } });
    BasicNotification.error('Ocurrió un error al intentar reasignar casos');
  }
};

export const updateCaseMe = (id, data, cb) => async (dispatch) => {
  dispatch({ type: UPDATE_CASE, cargando: true });
  BasicNotification.info('Actualizando caso...');
  try {
    if (data.action === 'addMessage') {
      const formData = new FormData();
      formData.append('action', data.action);
      formData.append('to', data.to);
      formData.append('cc', data.cc);
      formData.append('body', data.body);
      if (data.attachments) {
        map(data.attachments, (file) => {
          formData.append('attachments', file);
        });
      }
      data = formData;
    }
    await Case.updateCaseMe(id, data);
    if (cb) {
      cb();
    }
    dispatch({ type: UPDATE_CASE_SUCCESS, cargando: false });
    BasicNotification.success('Caso actualizado con éxito.');
  } catch (error) {
    console.error(error);
    if (error.status === 400 && error.response.body.code === 'CaseIsClosed') {
      dispatch({ type: UPDATE_CASE_FAILED, cargando: false, payload: { error } });
      BasicNotification.error('No es posible agregar actividades a un caso cerrado.');
    } else {
      dispatch({ type: UPDATE_CASE_FAILED, cargando: false, payload: { error } });
      BasicNotification.error('Ocurrió un error al intentar editar el caso');
    }
  }
};

export const updateCase = (id, data, cb) => async (dispatch) => {
  dispatch({ type: UPDATE_CASE, cargando: true });
  BasicNotification.info('Actualizando caso...');
  try {
    if (data.action === 'addMessage') {
      const formData = new FormData();
      formData.append('action', data.action);
      formData.append('to', data.to);
      if (data.cc) {
        map(data.cc, (cc) => {
          formData.append('cc', cc.value);
        });
      }
      formData.append('body', data.body);
      if (data.attachments) {
        map(data.attachments, (file) => {
          formData.append('attachments', file);
        });
      }
      data = formData;
      // return;
    }
    await Case.updateCase(id, data);
    if (cb) {
      cb();
    }
    dispatch({ type: UPDATE_CASE_SUCCESS, cargando: false });
    BasicNotification.success('Caso actualizado con éxito.');
  } catch (error) {
    console.error(error);
    if (error.status === 400 && error.response.body.code === 'CaseIsClosed') {
      dispatch({ type: UPDATE_CASE_FAILED, cargando: false, payload: { error } });
      BasicNotification.error('No es posible agregar actividades a un caso cerrado.');
    } else {
      dispatch({ type: UPDATE_CASE_FAILED, cargando: false, payload: { error } });
      BasicNotification.error('Ocurrió un error al intentar editar el caso');
    }
  }
};

export const getAllSubTypesCases = (query = {}, cb) => async (dispatch) => {
  dispatch({ type: GET_SUBTYPES, cargando: true });
  try {
    const { body, header } = await Case.getAllSubTypesCases(query);
    const countSubTypes = header['x-pagination-total-count'];
    const limitSubTypes = header['x-pagination-limit'];
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_SUBTYPES_SUCCESS, payload: { subtypesCases: body, countSubTypes, limitSubTypes } });
  } catch (error) {
    dispatch({ type: GET_SUBTYPES_FAILED, cargando: false, payload: { error } });
    console.error(error);
    BasicNotification.error('Ocurrió un error al intentar obtener los subtipos');
  }
};

export const createCase = (data, cb) => async (dispatch) => {
  dispatch({ type: CREATE_CASE, cargando: true });
  // console.log(data);
  try {
    BasicNotification.info('Creando caso...');
    const { body } = await Case.createCase(data);
    if (cb) {
      cb(body);
    }
    dispatch({ type: CREATE_CASE_SUCCESS, cargando: false, payload: { caso: body } });
    BasicNotification.success('Caso creado con éxito.');
  } catch (error) {
    console.error(error);
    if (error.status === 404) {
      BasicNotification.error('El caso no pudo ser ingresado, error en la api.');
    } else {
      BasicNotification.error('Ocurrió un error al intentar crear el caso.');
    }
    dispatch({ type: CREATE_CASE_FAILED, cargando: false, error });
  }
};

export const createSubCase = (data, cb) => async (dispatch) => {
  dispatch({ type: CREATE_SUBCASE, cargandoSub: true });
  // console.log(data);
  try {
    BasicNotification.info('Creanda tipificación...');
    const { body } = await Case.createSubType(data);
    if (cb) {
      cb(body);
    }
    dispatch({ type: CREATE_SUBCASE_SUCCESS, cargandoSub: false, payload: { subType: body } });
    BasicNotification.success('Tipificación creada con éxito.');
  } catch (error) {
    console.error(error);
    if (error.status === 404) {
      BasicNotification.error('La tipificación no pudo ser ingresado, error en la api.');
    }
    dispatch({ type: CREATE_SUBCASE_FAILED, cargandoSub: false, error });
  }
};

export const updateSubCase = (id, data, cb) => async (dispatch) => {
  dispatch({ type: UPDATE_SUBCASE, updating: true });
  BasicNotification.info('Actualizando Tipificación...');
  try {
    await Case.updateSubCase(id, data);
    if (cb) {
      cb();
    }
    dispatch({ type: UPDATE_SUBCASE_SUCCESS, updating: false });
    BasicNotification.success('Tipificación actualizada con éxito.');
  } catch (error) {
    console.error(error);
    // if (error.status === 409 && error.response.body.code === 'EmailAlreadyExists') {
    //   BasicNotification.error('El email ingresado ya está registrado en el sistema.');
    // } else {
    dispatch({ type: UPDATE_SUBCASE_FAILED, updating: false, payload: { error } });
    BasicNotification.error('Ocurrió un error al intentar editar la tipificación');
    // }
  }
};

export const createMyCase = (data, cb) => async (dispatch) => {
  dispatch({ type: CREATE_CASE, cargando: true });
  // console.log(data);
  try {
    BasicNotification.info('Creando caso...');
    const { body } = await Case.createCaseMe(data);
    if (cb) {
      cb(body);
    }
    dispatch({ type: CREATE_CASE_SUCCESS, cargando: false, payload: { caso: body } });
    BasicNotification.success('Caso creado con éxito.');
  } catch (error) {
    console.error(error);
    if (error.status === 404) {
      BasicNotification.error('El caso no pudo ser ingresado, error en la api.');
    }
    dispatch({ type: CREATE_CASE_FAILED, cargando: false, error });
  }
};

export const deleteSubCase = (id, cb) => async (dispatch) => {
  dispatch({ type: DELETE_SUBCASE });
  BasicNotification.info('Eliminado tipificación...');
  try {
    await Case.removeSubCaseById(id);
    if (cb) {
      cb();
    }
    dispatch({ type: DELETE_SUBCASE_SUCCESS });
    BasicNotification.success('tipificación eliminada con éxito.');
  } catch (error) {
    dispatch({ type: DELETE_SUBCASE_FAILED });
    console.error(error);
    if (error.status === 409 && error.response.body.code === 'SubtypeCaseNotDeleted') {
      BasicNotification.error('La tipificación ya esta siendo ocupada.');
    } else {
      BasicNotification.error('Ocurrió un error al intentar eliminar la tipificación');
    }
  }
};
