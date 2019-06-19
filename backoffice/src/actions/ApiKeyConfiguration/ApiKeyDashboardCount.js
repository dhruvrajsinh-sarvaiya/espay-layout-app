// Actions For Api PLan configuration dashbaord count 
// By Devang parekh 9/4/2019

// import types
import {
  GET_API_KEY_DASHBOARD_COUNT,
  GET_API_KEY_DASHBOARD_COUNT_SUCCESS,
  GET_API_KEY_DASHBOARD_COUNT_FAILURE
} from "Actions/types";

//action for api plan / key dashboard count and set type for reducers
export const getApiKeyDashboardCount = Data => ({
  type: GET_API_KEY_DASHBOARD_COUNT,
  payload: Data
});

//action for set Success and api plan / key dashboard count and set type for reducers
export const getApiKeyDashboardCountSuccess = response => ({
  type: GET_API_KEY_DASHBOARD_COUNT_SUCCESS,
  payload: response
});

//action for set failure and error to api plan / key dashboard count and set type for reducers
export const getApiKeyDashboardCountFailure = error => ({
  type: GET_API_KEY_DASHBOARD_COUNT_FAILURE,
  payload: error
});
