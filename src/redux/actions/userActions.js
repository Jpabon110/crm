/* eslint-disable no-console */
import Users from '../../api/Users';
import {
  GET_USERS,
  GET_USER_SUCCESS,
  GET_USER_FAILED,
  GET_CURRENT_USER,
  GET_CURRENT_USER_SUCCESS,
  GET_CURRENT_USER_FAILED,
} from '../../api/Types';
import BasicNotification from '../../shared/components/Notifications/BasicNotification';
import closeSesion from '../../helper/functions';

export const getSignature = (filename, cb) => async () => {
  try {
    const { body } = await Users.getSignature(filename);
    if (cb) {
      cb(body);
    }
  } catch (error) {
    if (error.status === 401) { closeSesion(); }
    BasicNotification.error('Ocurrió un error al intentar obtener la firma para la foto.');
  }
};

export const uploadAvatar = (params, cb) => async () => {
  BasicNotification.info('Subiendo imagen...');
  try {
    const { body } = await Users.uploadAvatar(params);
    if (cb) {
      cb(body);
    }
  } catch (error) {
    if (error.status === 401) { closeSesion(); }
    BasicNotification.error('Ocurrió un error al intentar subir el avatar');
  }
};

export const createUser = (data, cb) => async () => {
  try {
    BasicNotification.info('Creando usuario...');
    const { body } = await Users.create(data);
    if (cb) {
      cb(body);
    }
    BasicNotification.success('Usuario creado con éxito.');
  } catch (error) {
    if (error.status === 401) { closeSesion(); }
    if (error.status === 409 && error.response.body.code === 'EmailAlreadyExists') {
      BasicNotification.error('El email ingresado ya está registrado en el sistema.');
    } else if (error.status === 409 && error.response.body.code === 'RUTAlreadyExists') {
      BasicNotification.error('El rut ingresado ya está registrado en el sistema.');
    } else {
      BasicNotification.error('Ocurrió un error al intentar crear el usuario');
    }
  }
};

export const getUserById = (id, cb) => async () => {
  try {
    const { body } = await Users.getById(id);
    if (cb) {
      cb(body);
    }
  } catch (error) {
    if (error.status === 401) { closeSesion(); }
    if (error.status === 404) {
      BasicNotification.error('El usuario no está registrado en el sistema.');
    } else {
      BasicNotification.error('Ocurrió un error al intentar obtener el usuario');
    }
  }
};

export const updateUser = (id, data, cb) => async () => {
  BasicNotification.info('Actualizando usuario...');
  try {
    await Users.update(id, data);
    if (cb) {
      cb();
    }
    BasicNotification.success('Usuario actualizado con éxito.');
  } catch (error) {
    if (error.status === 401) { closeSesion(); }
    if (error.status === 409 && error.response.body.code === 'EmailAlreadyExists') {
      BasicNotification.error('El email ingresado ya está registrado en el sistema.');
    } else {
      BasicNotification.error('Ocurrió un error al intentar actualizar el usuario');
    }
  }
};

export const deleteUser = (id, cb) => async () => {
  BasicNotification.info('Eliminado usuario...');
  try {
    await Users.delete(id);
    if (cb) {
      cb();
    }
    BasicNotification.success('Usuario eliminado con éxito.');
  } catch (error) {
    console.log('aaaaaa', error.status);
    console.log('aaaaaa', error.response.body.code);
    if (error.status === 401) { closeSesion(); }

    if ((error.status === 409) && (error.response.body.code === 'UserNotDeleted')) {
      BasicNotification.error('No puedes eliminar a un usuario con casos asignados.');
    } else {
      BasicNotification.error('Ocurrió un error al intentar eliminar el usuario');
    }
  }
};

export const getUsers = (query, cb) => async (dispatch) => {
  dispatch({ type: GET_USERS });
  try {
    const { body, header } = await Users.get(query);
    const countUsers = header['x-pagination-total-count'];
    const limitUsers = header['x-pagination-limit'];
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_USER_SUCCESS, payload: { users: body, countUsers, limitUsers } });
  } catch (error) {
    dispatch({ type: GET_USER_FAILED, payload: { error } });
    if (error.status === 401) { closeSesion(); }
    BasicNotification.error('Ocurrió un error al intentar obtener los usuarios');
  }
};

export const getMe = cb => async (dispatch) => {
  dispatch({ type: GET_CURRENT_USER });
  try {
    const { body } = await Users.getMe();
    if (cb) {
      cb(body);
    }
    dispatch({ type: GET_CURRENT_USER_SUCCESS, payload: { currentUser: body } });
  } catch (error) {
    dispatch({ type: GET_CURRENT_USER_FAILED, payload: { error } });
    if (error.status === 401) { closeSesion(); }
    BasicNotification.error('Ocurrió un error al intentar obtener Información Personal');
  }
};

export const updateMe = (data, cb) => async () => {
  BasicNotification.info('Actualizando usuario...');
  try {
    await Users.updateMe(data);
    if (cb) {
      cb();
    }
    BasicNotification.success('Perfil actualizado con éxito.');
  } catch (error) {
    if (error.status === 401) { closeSesion(); }
    if (error.status === 409 && error.response.body.code === 'EmailAlreadyExists') {
      BasicNotification.error('El email ingresado ya está registrado en el sistema.');
    } else {
      BasicNotification.error('Ocurrió un error al intentar actualizar el Perfil');
    }
  }
};

export const changePassword = (data, cb) => async () => {
  BasicNotification.info('Actualizando Contraseña');
  try {
    await Users.updateMePassword(data);
    if (cb) {
      cb();
    }
    BasicNotification.success('Constraseña Actualizada con éxito.');
  } catch (error) {
    if (error.status === 401) { closeSesion(); }
    if (error.status === 409 && error.response.body.code === 'CurrentPasswordNotMatch') {
      BasicNotification.error('La contraseña actual no coincide.');
    } else {
      BasicNotification.error('Ocurrió un error al intentar Cambiar la Contraseña');
    }
  }
};
