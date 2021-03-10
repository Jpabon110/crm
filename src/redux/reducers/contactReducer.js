/* eslint-disable max-len */
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
  GET_CONTACT_RUT,
  GET_CONTACT_RUT_SUCCESS,
  GET_CONTACT_RUT_FAILED,
  GET_CONTRACT_BY_RUT,
  GET_CONTRACT_BY_RUT_SUCCESS,
  GET_CONTRACT_BY_RUT_FAILED,
  RESET_CONTACT_STATE,
} from '../../api/Types';

const initialState = {
  collection: [],
  count: 0,
  limit: 10,
  contact: null,
  cargando: false,
  update: false,
  contracts: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTACTS:
      return { ...state, cargando: true };
    case GET_CONTACTS_SUCCESS:
      return {
        ...state,
        cargando: false,
        collection: action.payload.contacts,
        count: action.payload.count,
        limit: action.payload.limit,
      };
    case GET_CONTACTS_FAILED:
      return { ...state, cargando: false, error: action.payload.error };
    case GET_CONTACT_RUT:
      return { ...state, cargando: true, update: false };
    case GET_CONTACT_RUT_SUCCESS:
      return {
        ...state,
        cargando: false,
        update: true,
        contact: action.payload.contact,
      };
    case GET_CONTACT_RUT_FAILED:
      return {
        ...state,
        cargando: false,
        error: action.payload.error,
        update: true,
      };
    case GET_CONTRACT_BY_RUT:
      return { ...state, cargandoContract: true, update: false };
    case GET_CONTRACT_BY_RUT_SUCCESS:
      return {
        ...state,
        cargandoContract: false,
        update: true,
        contracts: action.payload.contracts,
      };
    case GET_CONTRACT_BY_RUT_FAILED:
      return {
        ...state,
        cargandoContract: false,
        error: action.payload.error,
        update: false,
      };
    case CREATE_CONTACTS:
      return { ...state, creatting: true };
    case CREATE_CONTACTS_SUCCESS:
      return { ...state, contact: action.payload.contact, creatting: false };
    case CREATE_CONTACTS_FAILED:
      return { ...state, error: action.error, creatting: false };
    case UPDATE_CONTACT:
      return { ...state, cargando: true };
    case UPDATE_CONTACT_SUCCESS:
      return { ...state, cargando: false };
    case UPDATE_CONTACT_FAILED:
      return { ...state, cargando: false, error: action.payload.error };
    case DELETE_CONTACTS:
      return { ...state };
    case DELETE_CONTACTS_SUCCESS:
      return { ...state };
    case DELETE_CONTACTS_FAILED:
      return { ...state };
    case RESET_CONTACT_STATE:
      return initialState;
    default:
      return state;
  }
};
