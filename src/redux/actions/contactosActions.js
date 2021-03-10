/* eslint-disable no-console */
import Contactos from '../../api/Contactos';
import BasicNotification from '../../shared/components/Notifications/BasicNotification';
import {
  GET_CONTACTS,
  GET_CONTACTS_SUCCESS,
  GET_CONTACTS_FAILED,
  CREATE_CONTACTS,
  CREATE_CONTACTS_SUCCESS,
  CREATE_CONTACTS_FAILED,
  UPDATE_CONTACT,
  UPDATE_CONTACT_SUCCESS,
  UPDATE_CONTACT_FAILED,
  DELETE_CONTACTS,
  DELETE_CONTACTS_SUCCESS,
  DELETE_CONTACTS_FAILED,
  GET_CONTACT_ID,
  GET_CONTACT_ID_SUCCESS,
  GET_CONTACT_ID_FAILED,
  GET_CONTACT_RUT,
  GET_CONTACT_RUT_SUCCESS,
  GET_CONTACT_RUT_FAILED,
  GET_CONTRACT_BY_RUT,
  GET_CONTRACT_BY_RUT_SUCCESS,
  GET_CONTRACT_BY_RUT_FAILED,
  RESET_CONTACT_STATE,
} from '../../api/Types';

export const createContacts = (data, cb) => async (dispatch) => {
  dispatch({ type: CREATE_CONTACTS });
  // console.log(data);
  try {
    BasicNotification.info('Creando contacto...');
    const { body } = await Contactos.create(data);
    if (cb) {
      cb(body);
    }
    dispatch({ type: CREATE_CONTACTS_SUCCESS, payload: { contacts: body } });
    BasicNotification.success('Contacto creado con éxito.');
  } catch (error) {
    console.error(error);
    if (error.status === 409 && error.response.body.code === 'EmailAlreadyExists') {
      BasicNotification.error('El email ingresado ya está registrado en el sistema.');
    } else if (error.status === 409 && error.response.body.code === 'RUTAlreadyExists') {
      BasicNotification.error('El rut ingresado ya está registrado en el sistema.');
    } else {
      BasicNotification.error('Ocurrió un error al intentar crear el usuario');
    }
    dispatch({ type: CREATE_CONTACTS_FAILED, error });
  }
};

export const getContacts = (query = {}, cb) => async (dispatch) => {
  dispatch({ type: GET_CONTACTS, cargando: true });
  try {
    const { body, header } = await Contactos.get(query);
    const count = header['x-pagination-total-count'];
    const limit = header['x-pagination-limit'];
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_CONTACTS_SUCCESS, payload: { contacts: body, count, limit } });
  } catch (error) {
    dispatch({ type: GET_CONTACTS_FAILED, cargando: false, payload: { error } });
    console.error(error);
    BasicNotification.error('Ocurrió un error al intentar obtener los usuarios');
  }
};

export const getContactById = (id, cb) => async (dispatch) => {
  dispatch({ type: GET_CONTACT_ID, cargando: true });
  try {
    const { body } = await Contactos.getById(id);

    if (cb) {
      cb(body.contact);
    }
    dispatch({ type: GET_CONTACT_ID_SUCCESS, cargando: false, payload: { contact: body.contact } });
  } catch (error) {
    console.error(error);
    if (error.status === 404) {
      BasicNotification.error('El contacto no está registrado en el sistema.');
    } else {
      BasicNotification.error('Ocurrió un error al intentar obtener el usuario');
    }
    dispatch({ type: GET_CONTACT_ID_FAILED, cargando: false, payload: { error } });
  }
};

export const getContactByRut = (rut, cb) => async (dispatch) => {
  dispatch({ type: GET_CONTACT_RUT, cargando: true });
  try {
    const { body } = await Contactos.getByRut(rut);
    if (cb) {
      cb(body);
    }
    dispatch({
      type: GET_CONTACT_RUT_SUCCESS,
      cargando: false,
      payload: { contact: body },
    });
  } catch (error) {
    console.error(error);
    if (error.status === 404) {
      BasicNotification.error('El contacto no está registrado en el sistema.');
      if (cb) {
        cb();
      }
    } else if (error.status === 400 && error.response.body.code === 'ErrorTrinidad') {
      BasicNotification.error('Error en servicio externo.');
    } else {
      BasicNotification.error('Ocurrió un error al intentar obtener el cliente');
    }
    dispatch({
      type: GET_CONTACT_RUT_FAILED,
      cargando: false,
      payload: { error },
    });
  }
};

export const getContractByRut = rut => async (dispatch) => {
  dispatch({ type: GET_CONTRACT_BY_RUT });
  try {
    const { body } = await Contactos.getContractByRut(rut);
    dispatch({
      type: GET_CONTRACT_BY_RUT_SUCCESS,
      payload: { contracts: body },
    });
  } catch (error) {
    console.error(error);
    if (error.status === 404) {
      BasicNotification.error('El contacto no está registrado en el sistema.');
    } else if (error.status === 400 && error.response.body.code === 'ErrorTrinidad') {
      BasicNotification.error('Error en servicio externo.');
    } else {
      BasicNotification.error('Ocurrió un error al intentar obtener el usuario');
    }
    dispatch({
      type: GET_CONTRACT_BY_RUT_FAILED,
      payload: { error },
    });
  }
};


export const updateContact = (id, data, cb) => async (dispatch) => {
  BasicNotification.info('Actualizando usuario...');


  dispatch({ type: UPDATE_CONTACT });
  try {
    await Contactos.update(id, data);
    dispatch({ type: UPDATE_CONTACT_SUCCESS });
    if (cb) {
      cb();
    }
    BasicNotification.success('Usuario actualizado con éxito.');
  } catch (error) {
    console.error(error);
    dispatch({ type: UPDATE_CONTACT_FAILED, payload: { error } });
    if (error.status === 409 && error.response.body.code === 'EmailAlreadyExists') {
      BasicNotification.error('El email ingresado ya está registrado en el sistema.');
    } else {
      BasicNotification.error('Ocurrió un error al intentar actualizar el usuario');
    }
  }
};

export const deleteUser = (id, cb) => async (dispatch) => {
  dispatch({ type: DELETE_CONTACTS });
  BasicNotification.info('Eliminado usuario...');
  try {
    await Contactos.removeById(id);
    if (cb) {
      cb();
    }
    dispatch({ type: DELETE_CONTACTS_SUCCESS });
    BasicNotification.success('Usuario eliminado con éxito.');
  } catch (error) {
    dispatch({ type: DELETE_CONTACTS_FAILED });
    console.error(error);
    if (error.status === 409 && error.response.body.code === 'ContactNotDeleted') {
      BasicNotification.error('El cliente no se puede eliminado porque esta asociado a una operación.');
    } else {
      BasicNotification.error('Ocurrió un error al intentar eliminar el usuario');
    }
  }
};

export const resetState = () => (dispatch) => {
  dispatch({ type: RESET_CONTACT_STATE });
};
