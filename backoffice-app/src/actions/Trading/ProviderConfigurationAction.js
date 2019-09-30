// Actions For Provider Configuration 
// import types
import {
  //provider configuration list 
  GET_PROVIDER_CONFIGURATION_LIST,
  GET_PROVIDER_CONFIGURATION_LIST_SUCCESS,
  GET_PROVIDER_CONFIGURATION_LIST_FAILURE,

  //add provider configuration
  ADD_PROVIDER_CONFIGURATION_LIST,
  ADD_PROVIDER_CONFIGURATION_LIST_SUCCESS,
  ADD_PROVIDER_CONFIGURATION_LIST_FAILURE,

  //update provider configuration
  UPDATE_PROVIDER_CONFIGURATION_LIST,
  UPDATE_PROVIDER_CONFIGURATION_LIST_SUCCESS,
  UPDATE_PROVIDER_CONFIGURATION_LIST_FAILURE,

  //clear add provider configuration and update provider configuration
  CLEAR_PROVIDER_CONFIGURATION,
  CLEAR_PROVIDER_CONFIGURATION_LIST_DATA,
} from "../ActionTypes";

//action for Get Provider Configuration and set type for reducers
export const getProviderConfigList = () => ({
  type: GET_PROVIDER_CONFIGURATION_LIST,
});

//action for set Success and Get Provider Configuration and set type for reducers
export const getProviderConfigListSuccess = response => ({
  type: GET_PROVIDER_CONFIGURATION_LIST_SUCCESS,
  payload: response
});

//action for set failure and error to Get Provider Configuration and set type for reducers
export const getProviderConfigListFailure = error => ({
  type: GET_PROVIDER_CONFIGURATION_LIST_FAILURE,
  payload: error
});

//action for add Provider Configuration and set type for reducers
export const addProviderConfig = Data => ({
  type: ADD_PROVIDER_CONFIGURATION_LIST,
  payload: { Data }
});

//action for set Success and add Provider Configuration and set type for reducers
export const addProviderConfigSuccess = response => ({
  type: ADD_PROVIDER_CONFIGURATION_LIST_SUCCESS,
  payload: response
});

//action for set failure and error to add Provider Configuration and set type for reducers
export const addProviderConfigFailure = error => ({
  type: ADD_PROVIDER_CONFIGURATION_LIST_FAILURE,
  payload: error
});

//action for UPDATE Provider Configuration and set type for reducers
export const updateProviderConfig = Data => ({
  type: UPDATE_PROVIDER_CONFIGURATION_LIST,
  payload: { Data }
});

//action for set Success and UPDATE Provider Configuration and set type for reducers
export const updateProviderConfigSuccess = response => ({
  type: UPDATE_PROVIDER_CONFIGURATION_LIST_SUCCESS,
  payload: response
});

//action for set failure and error to UPDATE Provider Configuration and set type for reducers
export const updateProviderConfigFailure = error => ({
  type: UPDATE_PROVIDER_CONFIGURATION_LIST_FAILURE,
  payload: error
});

//clear add provider configuration and update provider configuration
export const clearProviderConfig = () => ({
  type: CLEAR_PROVIDER_CONFIGURATION,
});

//clear data
export const clearProviderConfigrationList = () => ({
  type: CLEAR_PROVIDER_CONFIGURATION_LIST_DATA,
});  