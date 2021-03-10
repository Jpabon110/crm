/* eslint-disable no-console */
import Auth from '../../api/Auth';
import BasicNotification from '../../shared/components/Notifications/BasicNotification';

export const restPassword = (data, cb) => async () => {
  BasicNotification.info('Enviando correo...');
  try {
    const { body } = await Auth.restPassword(data);
    if (cb) {
      cb(body);
    }
    BasicNotification.info('Correo enviado con éxito.');
  } catch (error) {
    console.error(error);
    if (error.status === 404) {
      BasicNotification.error('El usuario no está registrado en el sistema.');
    } else {
      BasicNotification.error('Ocurrió un error al intentar resetear la contraseña.');
    }
  }
};

export const signIn = (data, cb) => async () => {
  try {
    const { body } = await Auth.signIn(data);
    if (cb) {
      cb(body);
    }
  } catch (error) {
    console.error(error);
    BasicNotification.error('Ocurrió un error al intentar iniciar sesión.');
  }
};
