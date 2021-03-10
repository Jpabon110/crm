/* eslint-disable max-len */
import {
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
  CREATE_CASE,
  CREATE_CASE_SUCCESS,
  CREATE_CASE_FAILED,
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

const initState = {
  collection: [],
  count: 0,
  limit: 10,
  allCases: [],
  loadingReasing: false,
  dataDashboard: {},
  summary: {
    withinTerm: 0,
    OutTerm: 0,
    open: 0,
    close: 0,
    total: 0,
  },
  caseInfo: {

    status: '',
    _id: '',
    type: {
      _id: '',
      name: '',
    },
    subtype: {
      _id: '',
      name: '',
    },
    origin: '',
    client: {
      emails: [
        '',
      ],
      _id: '',
      names: '',
      paternalSurname: '',
      maternalSurname: '',
      rent: 0,
      birthdate: '',
      rut: '',
      phones: [
        {
          code: '',
          number: '',
        },
      ],
      addresses: [],
      profile: null,
      nationality: {
        value: '',
        label: '',
      },
      sex: {
        value: '',
        label: '',
      },
      civilStatus: {
        value: '',
        label: '',
      },
      createdAt: '',
      updatedAt: '',
    },
  },
};

export default (state = initState, action) => {
  switch (action.type) {
    case GET_SUMMARY_CASES:
      return { ...state, disable: true };
    case GET_SUMMARY_CASES_SUCCESS:
      return {
        ...state,
        disable: false,
        summary: action.payload.summary,
      };
    case GET_SUMMARY_CASES_FAILED:
      return { ...state, cargando: false, error: action.payload.error };
    case GET_TYPES:
      return { ...state, disable: true };
    case GET_TYPES_SUCCESS:
      return {
        ...state,
        disable: false,
        types: action.payload.typesCases,
      };
    case GET_TYPES_FAILED:
      return { ...state, cargando: false, error: action.payload.error };
    case GET_ALL_CASE:
      return { ...state, loadingCases: true };
    case GET_ALL_CASE_SUCCESS:
      return {
        ...state,
        loadingCases: false,
        allCases: action.payload.allCases,
        countCases: action.payload.countCases,
        limitCases: action.payload.limitCases,
      };
    case GET_ALL_CASE_FAILED:
      return { ...state, loadingCases: false, error: action.payload.error };
    case GET_ALL_CASE_DASHBOARD:
      return { ...state, gettingDataDashboard: true };
    case GET_ALL_CASE_DASHBOARD_SUCCESS:
      return { ...state, gettingDataDashboard: false, dataDashboard: action.payload };
    case GET_ALL_CASE_DASHBOARD_FAILED:
      return { ...state, gettingDataDashboard: false, error: action.payload.error };
    case GET_CASE_ID:
      return { ...state, loadingInfoCase: true };
    case GET_CASE_ID_SUCCESS:
      return {
        ...state,
        loadingInfoCase: false,
        caseInfo: action.payload.caseInfo,
      };
    case GET_CASE_ID_FAILED:
      return { ...state, loadingInfoCase: false, error: action.payload.error };
    case DELETE_CASE:
      return { ...state };
    case DELETE_CASE_SUCCESS:
      return { ...state };
    case DELETE_CASE_FAILED:
      return { ...state };
    case CREATE_CASE:
      return { ...state, disableCreate: true };
    case CREATE_CASE_SUCCESS:
      return {
        ...state,
        disableCreate: false,
        caso: action.payload.caso,
      };
    case CREATE_CASE_FAILED:
      return { ...state, disableCreate: false, error: action.error };
    case UPDATE_CASE:
      return { ...state, disableCloseCase: true };
    case UPDATE_CASE_SUCCESS:
      return {
        ...state,
        disableCloseCase: false,
      };
    case UPDATE_CASE_FAILED:
      return { ...state, disableCloseCase: false, error: action.error };
    case UPDATE_CASE_MANY:
      return { ...state, loadingReasing: true };
    case UPDATE_CASE_MANY_SUCCESS:
      return {
        ...state,
        loadingReasing: false,
      };
    case UPDATE_CASE_MANY_FAILED:
      return { ...state, loadingReasing: false, error: action.error };
    case CREATE_SUBCASE:
      return { ...state, disableCreateSub: true };
    case CREATE_SUBCASE_SUCCESS:
      return {
        ...state,
        disableCreateSub: false,
        subTypeCreated: action.payload.subType,
      };
    case CREATE_SUBCASE_FAILED:
      return { ...state, disableCreateSub: false, error: action.error };
    case UPDATE_SUBCASE:
      return { ...state, updating: true };
    case UPDATE_SUBCASE_SUCCESS:
      return {
        ...state,
        updating: false,
      };
    case UPDATE_SUBCASE_FAILED:
      return { ...state, updating: false, error: action.error };
    case DELETE_SUBCASE:
      return { ...state };
    case DELETE_SUBCASE_SUCCESS:
      return { ...state };
    case DELETE_SUBCASE_FAILED:
      return { ...state };
    case GET_SUBTYPES:
      return { ...state, loadingSubTypes: true };
    case GET_SUBTYPES_SUCCESS:
      return {
        ...state,
        loadingSubTypes: false,
        subtypes: action.payload.subtypesCases,
        countSubTypes: action.payload.countSubTypes,
        limitSubTypes: action.payload.limitSubTypes,
      };
    case GET_SUBTYPES_FAILED:
      return {
        ...state, loadingSubTypes: false, cargando: false, error: action.payload.error,
      };
    default:
      return state;
  }
};
