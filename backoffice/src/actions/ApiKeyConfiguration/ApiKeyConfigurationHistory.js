// Actions For Api key configruation history history By Devang parekh 12/3/2019

// import types
import {
  GET_API_KEY_CONFIGURATION_HISTORY,
  GET_API_KEY_CONFIGURATION_HISTORY_SUCCESS,
  GET_API_KEY_CONFIGURATION_HISTORY_FAILURE,
} from "Actions/types";

//action for api Key configuration historyn and set type for reducers
export const getApiKeyConfigurationHistory = Data => ({
  type: GET_API_KEY_CONFIGURATION_HISTORY,
  payload: Data
});

//action for set Success and api Key configuration historyn and set type for reducers
export const getApiKeyConfigurationHistorySuccess = response => ({
  type: GET_API_KEY_CONFIGURATION_HISTORY_SUCCESS,
  payload: response
});

//action for set failure and error to api Key configuration historyn and set type for reducers
export const getApiKeyConfigurationHistoryFailure = error => ({
  type: GET_API_KEY_CONFIGURATION_HISTORY_FAILURE,
  payload: error
});