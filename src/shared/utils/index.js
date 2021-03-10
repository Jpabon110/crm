/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import includes from 'lodash/includes';
import jwtDecode from 'jwt-decode';

export const setRUTFormat = (value) => {
  value = value.replace(/[^K0-9\s]/gi, '');
  if (value && value.length > 1) {
    const { length } = value;
    const checkDigit = value.substring(length - 1);
    const rest = value.substring(0, length - 1);
    let lastRest = '';
    let count = 0;
    for (let i = rest.length - 1; i >= 0; i -= 1) {
      if (count === 3) {
        count = 0;
        lastRest = `.${lastRest}`;
      }
      lastRest = `${rest[i]}${lastRest}`;
      count += 1;
    }
    value = `${lastRest}-${checkDigit}`;
  }
  return value;
};

export const isUserAllowed = (rol) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const { user: { roles } } = jwtDecode(token);
    return includes(roles, rol);
  }
  return false;
};

export const findFullName = (contact) => {
  let fullName = '';

  if (contact.companyName) {
    fullName += ` ${contact.companyName}`;
  }

  if (contact.names) {
    fullName += ` ${contact.names}`;
  }

  if (contact.paternalSurname) {
    fullName += ` ${contact.paternalSurname}`;
  }

  if (contact.maternalSurname) {
    fullName += ` ${contact.maternalSurname}`;
  }

  return fullName;
};

export const isOptionAllowed = (_roles) => {
  if (_roles) {
    const targets = typeof _roles === 'string' ? [_roles] : [..._roles];
    const token = localStorage.getItem('accessToken');
    const { user } = jwtDecode(token);
    // console.log(user.roles);
    // console.log(targets);
    // console.log(targets);

    for (const rol of targets) {
      if (includes(user.roles, rol)) {
        return true;
      }
    }
  }
  return false;
};
