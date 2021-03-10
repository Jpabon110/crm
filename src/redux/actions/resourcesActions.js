/* eslint-disable no-console */
import Resources from '../../api/Resources';
import BasicNotification from '../../shared/components/Notifications/BasicNotification';
import closeSesion from '../../helper/functions';
import {
  GET_ALL_REGIONS,
  GET_ALL_REGIONS_SUCCESS,
  GET_ALL_REGIONS_FAILED,
  GET_ALL_ROLLS,
  GET_ALL_ROLLS_SUCCESS,
  GET_ALL_ROLLS_FAILED,
  GET_ALL_COMMUNS,
  GET_ALL_COMMUNS_SUCCESS,
  GET_ALL_COMMUNS_FAILED,
  GET_SEXES,
  GET_SEXES_SUCCESS,
  GET_SEXES_FAILED,
  GET_NATIONALITIES,
  GET_NATIONALITIES_SUCCESS,
  GET_NATIONALITIES_FAILED,
  GET_CIVILSTATUS,
  GET_CIVILSTATUS_SUCCESS,
  GET_CIVILSTATUS_FAILED,
  GET_SETTING,
  GET_SETTING_SUCCESS,
  GET_SETTING_FAILED,
  GET_SETTING_URL_CUSTOMER_SERVICE,
  GET_SETTING_URL_CUSTOMER_SERVICE_SUCCESS,
  GET_SETTING_URL_CUSTOMER_SERVICE_FAILED,
  GET_SETTING_URL_PRE_PAID,
  GET_SETTING_URL_PRE_PAID_SUCCESS,
  GET_SETTING_URL_PRE_PAID_FAILED,
  GET_SETTING_URL_PRE_PAID_INTERNAL,
  GET_SETTING_URL_PRE_PAID_INTERNAL_SUCCESS,
  GET_SETTING_URL_PRE_PAID_INTERNAL_FAILED,
  GET_ALL_NOTIFICATIONS,
  GET_ALL_NOTIFICATIONS_SUCCESS,
  GET_ALL_NOTIFICATIONS_FAILED,
  PUT_PRE_PAID,
  PUT_PRE_PAID_SUCCESS,
  PUT_PRE_PAID_FAILED,
} from '../../api/Types';

export const getNotifications = cb => async (dispatch) => {
  dispatch({ type: GET_ALL_NOTIFICATIONS, loadingNotifications: true });
  try {
    const { body } = await Resources.getNotifications();
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_ALL_NOTIFICATIONS_SUCCESS, loadingNotifications: false, payload: { notifications: body } });
  } catch (error) {
    dispatch({ type: GET_ALL_NOTIFICATIONS_FAILED, loadingNotifications: false, payload: { error } });
    if (error.status === 401) {
      console.error(error);
      closeSesion();
    } else {
      BasicNotification.error('Ocurrió un error al intentar obtener las notificaciones.');
    }
  }
};

export const updateSettingsPrePaid = (id, data, cb) => async (dispatch) => {
  dispatch({ type: PUT_PRE_PAID, cargando: true });
  BasicNotification.info('Actualizando Tipificación...');
  try {
    await Resources.updateSettingsPrePaid(id, data);
    if (cb) {
      cb();
    }
    dispatch({ type: PUT_PRE_PAID_SUCCESS });
    BasicNotification.info('Tipificaciones actualizandas');
  } catch (error) {
    dispatch({ type: PUT_PRE_PAID_FAILED, payload: { error } });
    if (error.status === 401) {
      console.error(error);
      closeSesion();
    } else {
      BasicNotification.error('Ocurrió un error al intentar modificar la tipificación.');
    }
  }
};

export const getSettings = () => async (dispatch) => {
  dispatch({ type: GET_SETTING, cargando: true });
  try {
    const { body } = await Resources.getSettings();
    dispatch({ type: GET_SETTING_SUCCESS, payload: { settings: body } });
  } catch (error) {
    dispatch({ type: GET_SETTING_FAILED, cargando: false, payload: { error } });
    if (error.status === 401) {
      console.error(error);
      closeSesion();
    }
  }
};

export const getSettingsUrlCustomerService = () => async (dispatch) => {
  dispatch({ type: GET_SETTING_URL_CUSTOMER_SERVICE, cargando: true });
  try {
    const { body } = await Resources.getSettingsUrlCustomerService();
    dispatch({ type: GET_SETTING_URL_CUSTOMER_SERVICE_SUCCESS, payload: { settingsUrlCustomer: body } });
  } catch (error) {
    dispatch({ type: GET_SETTING_URL_CUSTOMER_SERVICE_FAILED, cargando: false, payload: { error } });
    if (error.status === 401) {
      console.error(error);
      closeSesion();
    } else {
      BasicNotification.error('Ocurrió un error al intentar obtener la URL Servicio cliente.');
    }
  }
};

export const getSettingsUrlPrePaid = () => async (dispatch) => {
  dispatch({ type: GET_SETTING_URL_PRE_PAID, cargando: true });
  try {
    const { body } = await Resources.getSettingsUrlPrePaid();
    dispatch({ type: GET_SETTING_URL_PRE_PAID_SUCCESS, payload: { settingsUrlPre: body } });
  } catch (error) {
    dispatch({ type: GET_SETTING_URL_PRE_PAID_FAILED, cargando: false, payload: { error } });
    if (error.status === 401) {
      console.error(error);
      closeSesion();
    } else {
      BasicNotification.error('Ocurrió un error al intentar obtener la URL Pre pago.');
    }
  }
};

export const getSettingsUrlPrePaidInternal = () => async (dispatch) => {
  dispatch({ type: GET_SETTING_URL_PRE_PAID_INTERNAL, cargando: true });
  try {
    const { body } = await Resources.getSettingsUrlPrePaidInternal();
    dispatch({ type: GET_SETTING_URL_PRE_PAID_INTERNAL_SUCCESS, payload: { settingsUrlPreInternal: body } });
  } catch (error) {
    dispatch({ type: GET_SETTING_URL_PRE_PAID_INTERNAL_FAILED, cargando: false, payload: { error } });
    if (error.status === 401) {
      console.error(error);
      closeSesion();
    } else {
      BasicNotification.error('Ocurrió un error al intentar obtener la URL Pre pago.');
    }
  }
};

export const getRegions = (query = { all: true }, cb) => async (dispatch) => {
  dispatch({ type: GET_ALL_REGIONS, cargando: true });
  try {
    const { body } = await Resources.getRegions(query);
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_ALL_REGIONS_SUCCESS, payload: { Regions: body } });
  } catch (error) {
    dispatch({ type: GET_ALL_REGIONS_FAILED, cargando: false, payload: { error } });
    if (error.status === 401) {
      console.error(error);
      closeSesion();
    }
  }
};


export const getSexes = (query = { all: true }, cb) => async (dispatch) => {
  dispatch({ type: GET_SEXES, cargando: true });
  try {
    const { body } = await Resources.getSexes(query);
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_SEXES_SUCCESS, payload: { sexes: body } });
  } catch (error) {
    dispatch({ type: GET_SEXES_FAILED, cargando: false, payload: { error } });
    if (error.status === 401) {
      console.error(error);
      closeSesion();
    }
  }
};


export const getNationalities = (query = { all: true }, cb) => async (dispatch) => {
  dispatch({ type: GET_NATIONALITIES, cargando: true });
  try {
    const { body } = await Resources.getNationalities(query);
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_NATIONALITIES_SUCCESS, payload: { nationalities: body } });
  } catch (error) {
    dispatch({ type: GET_NATIONALITIES_FAILED, cargando: false, payload: { error } });
    if (error.status === 401) {
      console.error(error);
      closeSesion();
    }
  }
};

export const getCivilStatus = (query = { all: true }, cb) => async (dispatch) => {
  dispatch({ type: GET_CIVILSTATUS, cargando: true });
  try {
    const { body } = await Resources.getCivilStatus(query);
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_CIVILSTATUS_SUCCESS, payload: { civilStatus: body } });
  } catch (error) {
    dispatch({ type: GET_CIVILSTATUS_FAILED, cargando: false, payload: { error } });
    if (error.status === 401) {
      console.error(error);
      closeSesion();
    }
  }
};

export const getRoles = (query = { all: true }, cb) => async (dispatch) => {
  dispatch({ type: GET_ALL_ROLLS, cargando: true });
  try {
    const { body } = await Resources.getRoles(query);
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_ALL_ROLLS_SUCCESS, payload: { Roles: body } });
  } catch (error) {
    dispatch({ type: GET_ALL_ROLLS_FAILED, cargando: false, payload: { error } });
    if (error.status === 401) {
      console.error(error);
      closeSesion();
    }
  }
};

export const getCommuns = (id, cb) => async (dispatch) => {
  dispatch({ type: GET_ALL_COMMUNS, cargando: true });
  try {
    const { body } = await Resources.getCommuns(id);
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_ALL_COMMUNS_SUCCESS, payload: { Communs: body } });
  } catch (error) {
    dispatch({ type: GET_ALL_COMMUNS_FAILED, cargando: false, payload: { error } });
    if (error.status === 401) {
      console.error(error);
      closeSesion();
    }
  }
};
