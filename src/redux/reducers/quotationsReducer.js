/* eslint-disable max-len */
import {
  GET_ALL_QUOTATIONS,
  GET_ALL_QUOTATIONS_SUCCESS,
  GET_ALL_QUOTATIONS_FAILED,
  CREATE_QUOTATIONS,
  GET_ALL_QUOTATIONS_DASHBOARD,
  GET_ALL_QUOTATIONS_DASHBOARD_SUCCESS,
  GET_ALL_QUOTATIONS_DASHBOARD_FAILED,
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
  SEND_FORM,
  SEND_FORM_SUCCESS,
  SEND_FORM_FAILED,
  DELETE_QUOTATIONS,
  DELETE_QUOTATIONS_SUCCESS,
  DELETE_QUOTATIONS_FAILED,
  GET_SUMMARY_QUOTATIONS,
  GET_SUMMARY_QUOTATIONS_SUCCESS,
  GET_SUMMARY_QUOTATIONS_FAILED,
} from '../../api/Types';

const initState = {
  collection: [],
  count: 0,
  limit: 10,
  allQuotations: [],
  dataDashboard: {},
  summary: {
    total: 0,
  },
  quotationsInfo: {
    haveProperty: false,
    haveVehicle: false,
    status: '',
    _id: '',
    client: {
      _id: '',
      names: '',
      paternalSurname: '',
      maternalSurname: '',
      rut: null,
    },
    executive: {
      _id: '',
      firstName: '',
      lastName: '',
      avatar: '',
    },
    companyName: '',
    companyRUT: '',
    typeContract: '',
    dateEntry: '',
    rent: null,
    workPhone: '',
    officePhone: '',
    origin: '',
  },
};

export default (state = initState, action) => {
  switch (action.type) {
    case GET_SUMMARY_QUOTATIONS:
      return { ...state, loadingQuoationsSummary: true };
    case GET_SUMMARY_QUOTATIONS_SUCCESS:
      return {
        ...state,
        loadingQuoationsSummary: false,
        summary: action.payload.summary,
      };
    case GET_SUMMARY_QUOTATIONS_FAILED:
      return { ...state, loadingQuoationsSummary: false, error: action.payload.error };
    case GET_ALL_QUOTATIONS:
      return { ...state, loadingQuoations: true };
    case GET_ALL_QUOTATIONS_SUCCESS:
      return {
        ...state,
        loadingQuoations: false,
        allQuotations: action.payload.allQuotations,
        countQuotations: action.payload.countQuotations,
        limitQuotations: action.payload.limitQuotations,
      };
    case GET_ALL_QUOTATIONS_FAILED:
      return { ...state, loadingQuoations: false, error: action.payload.error };
    case GET_ALL_QUOTATIONS_DASHBOARD:
      return { ...state, gettingDataDashboard: true };
    case GET_ALL_QUOTATIONS_DASHBOARD_SUCCESS:
      return { ...state, gettingDataDashboard: false, dataDashboard: action.payload };
    case GET_ALL_QUOTATIONS_DASHBOARD_FAILED:
      return { ...state, gettingDataDashboard: false, error: action.payload.error };
    case SEND_FORM:
      return { ...state, loadingSendForm: true };
    case SEND_FORM_SUCCESS:
      return {
        ...state,
        loadingSendForm: false,
        SendedForm: action.payload.SendedForm,
      };
    case SEND_FORM_FAILED:
      return { ...state, loadingSendForm: false, error: action.error };
    case CREATE_QUOTATIONS:
      return { ...state, loadingCreateQ: true };
    case CREATE_QUOTATIONS_SUCCESS:
      return {
        ...state,
        loadingCreateQ: false,
        quotationCreated: action.payload.quotation,
      };
    case CREATE_QUOTATIONS_FAILED:
      return { ...state, loadingCreateQ: false, error: action.error };
    case GET_QUOTATIONS_ID:
      return { ...state, loadingInfoQuotations: true };
    case GET_QUOTATIONS_ID_SUCCESS:
      return {
        ...state,
        loadingInfoQuotations: false,
        quotationInfo: action.payload.quotationInfo,
      };
    case GET_QUOTATIONS_ID_FAILED:
      return { ...state, loadingInfoQuotations: false, error: action.payload.error };
    case UPDATE_QUOTATIONS:
      return { ...state, disableCloseQuotations: true };
    case UPDATE_QUOTATIONS_SUCCESS:
      return {
        ...state,
        disableCloseQuotations: false,
      };
    case UPDATE_QUOTATIONS_FAILED:
      return { ...state, disableCloseQuotations: false, error: action.error };
    case UPDATE_QUOTATION_MANY:
      return { ...state, loadingReasing: true };
    case UPDATE_QUOTATION_MANY_SUCCESS:
      return {
        ...state,
        loadingReasing: false,
      };
    case UPDATE_QUOTATION_MANY_FAILED:
      return { ...state, loadingReasing: false, error: action.error };
    case DELETE_QUOTATIONS:
      return { ...state };
    case DELETE_QUOTATIONS_SUCCESS:
      return { ...state };
    case DELETE_QUOTATIONS_FAILED:
      return { ...state };
    default:
      return state;
  }
};
