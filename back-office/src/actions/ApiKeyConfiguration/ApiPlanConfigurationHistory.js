// Actions For Api PLan configruation history history By Devang parekh 11/3/2019

// import types
import {
  GET_API_PLAN_CONFIGURATION_HISTORY,
  GET_API_PLAN_CONFIGURATION_HISTORY_SUCCESS,
  GET_API_PLAN_CONFIGURATION_HISTORY_FAILURE,
} from "Actions/types";

//action for api plan configuration historyn and set type for reducers
export const getApiPlanConfigurationHistory = Data => ({
  type: GET_API_PLAN_CONFIGURATION_HISTORY,
  payload: Data
});

//action for set Success and api plan configuration historyn and set type for reducers
export const getApiPlanConfigurationHistorySuccess = response => ({
  type: GET_API_PLAN_CONFIGURATION_HISTORY_SUCCESS,
  payload: response
});

//action for set failure and error to api plan configuration historyn and set type for reducers
export const getApiPlanConfigurationHistoryFailure = error => ({
  type: GET_API_PLAN_CONFIGURATION_HISTORY_FAILURE,
  payload: error
});