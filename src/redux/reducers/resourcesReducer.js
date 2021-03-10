/* eslint-disable max-len */
import {
  GET_ALL_REGIONS,
  GET_ALL_REGIONS_SUCCESS,
  GET_ALL_REGIONS_FAILED,
  GET_ALL_COMMUNS,
  GET_ALL_COMMUNS_SUCCESS,
  GET_ALL_COMMUNS_FAILED,
  GET_ALL_ROLLS,
  GET_ALL_ROLLS_SUCCESS,
  GET_ALL_ROLLS_FAILED,
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
  PUT_PRE_PAID,
  PUT_PRE_PAID_SUCCESS,
  PUT_PRE_PAID_FAILED,
  GET_ALL_NOTIFICATIONS,
  GET_ALL_NOTIFICATIONS_SUCCESS,
  GET_ALL_NOTIFICATIONS_FAILED,
} from '../../api/Types';

const initState = {
  collection: [],
  Regions: [],
  Communs: [],
  count: 0,
  limit: 10,
  allQuotations: [],
};

export default (state = initState, action) => {
  switch (action.type) {
    case GET_ALL_NOTIFICATIONS:
      return { ...state, loadingNotifications: true };
    case GET_ALL_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loadingNotifications: false,
        notifications: action.payload.notifications,
      };
    case GET_ALL_NOTIFICATIONS_FAILED:
      return { ...state, loadingNotifications: false, error: action.payload.error };
    case GET_ALL_REGIONS:
      return { ...state, loadingRegions: true };
    case GET_ALL_REGIONS_SUCCESS:
      return {
        ...state,
        loadingRegions: false,
        Regions: action.payload.Regions,
      };
    case GET_ALL_REGIONS_FAILED:
      return { ...state, loadingRegions: false, error: action.payload.error };
    case GET_SETTING:
      return { ...state, loadingSetting: true };
    case GET_SETTING_SUCCESS:
      return {
        ...state,
        loadingSetting: false,
        settings: action.payload.settings,
      };
    case GET_SETTING_FAILED:
      return { ...state, loadingSetting: false, error: action.payload.error };
    case GET_SETTING_URL_CUSTOMER_SERVICE:
      return { ...state, loadingSettingUrlCustomer: true };
    case GET_SETTING_URL_CUSTOMER_SERVICE_SUCCESS:
      return {
        ...state,
        loadingSettingUrlCustomer: false,
        settingsUrlCustomer: action.payload.settingsUrlCustomer,
      };
    case GET_SETTING_URL_CUSTOMER_SERVICE_FAILED:
      return { ...state, loadingSettingUrlCustomer: false, error: action.payload.error };
    case GET_SETTING_URL_PRE_PAID:
      return { ...state, loadingSettingUrlPre: true };
    case GET_SETTING_URL_PRE_PAID_SUCCESS:
      return {
        ...state,
        loadingSettingUrlPre: false,
        settingsUrlPre: action.payload.settingsUrlPre,
      };
    case GET_SETTING_URL_PRE_PAID_FAILED:
      return { ...state, loadingSettingUrlPre: false, error: action.payload.error };
    case GET_SETTING_URL_PRE_PAID_INTERNAL:
      return { ...state, loadingSettingUrlPreInternal: true };
    case GET_SETTING_URL_PRE_PAID_INTERNAL_SUCCESS:
      return {
        ...state,
        loadingSettingUrlPreInternal: false,
        settingsUrlPreInternal: action.payload.settingsUrlPreInternal,
      };
    case GET_SETTING_URL_PRE_PAID_INTERNAL_FAILED:
      return { ...state, loadingSettingUrlPreInternal: false, error: action.payload.error };
    case PUT_PRE_PAID:
      return { ...state, loadingPrePaid: true };
    case PUT_PRE_PAID_SUCCESS:
      return {
        ...state,
        loadingPrePaid: false,
      };
    case PUT_PRE_PAID_FAILED:
      return { ...state, loadingPrePaid: false, error: action.payload.error };
    case GET_ALL_ROLLS:
      return { ...state, loadingRoles: true };
    case GET_ALL_ROLLS_SUCCESS:
      return {
        ...state,
        loadingRoles: false,
        Roles: action.payload.Roles,
      };
    case GET_ALL_ROLLS_FAILED:
      return { ...state, loadingRoles: false, error: action.payload.error };
    case GET_ALL_COMMUNS:
      return { ...state, loadingCommuns: true };
    case GET_ALL_COMMUNS_SUCCESS:
      return {
        ...state,
        loadingCommuns: false,
        Communs: action.payload.Communs,
      };
    case GET_ALL_COMMUNS_FAILED:
      return { ...state, loadingCommuns: false, error: action.error };
    case GET_SEXES:
      return { ...state, loadingSexes: true };
    case GET_SEXES_SUCCESS:
      return {
        ...state,
        loadingSexes: false,
        sexes: action.payload.sexes,
      };
    case GET_SEXES_FAILED:
      return { ...state, loadingSexes: false, error: action.error };
    case GET_NATIONALITIES:
      return { ...state, loadingNationalities: true };
    case GET_NATIONALITIES_SUCCESS:
      return {
        ...state,
        loadingNationalities: false,
        nationalities: action.payload.nationalities,
      };
    case GET_NATIONALITIES_FAILED:
      return { ...state, loadingNationalities: false, error: action.error };
    case GET_CIVILSTATUS:
      return { ...state, loadingCivilStatus: true };
    case GET_CIVILSTATUS_SUCCESS:
      return {
        ...state,
        loadingCivilStatus: false,
        civilStatus: action.payload.civilStatus,
      };
    case GET_CIVILSTATUS_FAILED:
      return { ...state, loadingCivilStatus: false, error: action.error };
    default:
      return state;
  }
};
