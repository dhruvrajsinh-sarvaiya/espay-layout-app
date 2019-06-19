// Actions For Api PLan Configuration By Tejas 21/2/2019

// import types
import {

  ADD_API_PLAN_CONFIG_DATA,
  ADD_API_PLAN_CONFIG_DATA_SUCCESS,
  ADD_API_PLAN_CONFIG_DATA_FAILURE,
  UPDATE_API_PLAN_CONFIG_DATA,
  UPDATE_API_PLAN_CONFIG_DATA_SUCCESS,
  UPDATE_API_PLAN_CONFIG_DATA_FAILURE,
  GET_API_PLAN_CONFIG_LIST,
  GET_API_PLAN_CONFIG_LIST_SUCCESS,
  GET_API_PLAN_CONFIG_LIST_FAILURE,
  GET_REST_METHOD_READ_ONLY,
  GET_REST_METHOD_READ_ONLY_SUCCESS,
  GET_REST_METHOD_READ_ONLY_FAILURE,
  GET_REST_METHOD_FULL_ACCESS,
  GET_REST_METHOD_FULL_ACCESS_SUCCESS,
  GET_REST_METHOD_FULL_ACCESS_FAILURE,
  ENABLE_DISABLE_API_PLAN,
  ENABLE_DISABLE_API_PLAN_SUCCESS,
  ENABLE_DISABLE_API_PLAN_FAILURE,
} from "Actions/types";

//action for add Api Plan Configuration and set type for reducers
export const addApiPlanConfigData = Data => ({
  type: ADD_API_PLAN_CONFIG_DATA,
  payload: { Data }
});

//action for set Success and add Api Plan Configuration and set type for reducers
export const addApiPlanConfigDataSuccess = response => ({
  type: ADD_API_PLAN_CONFIG_DATA_SUCCESS,
  payload: response
});

//action for set failure and error to add Api Plan Configuration and set type for reducers
export const addApiPlanConfigDataFailure = error => ({
  type: ADD_API_PLAN_CONFIG_DATA_FAILURE,
  payload: error
});

//action for UPDATE Api Plan Configuration and set type for reducers
export const updateApiPlanConfigData = Data => ({
  type: UPDATE_API_PLAN_CONFIG_DATA,
  payload: { Data }
});

//action for set Success and UPDATE Api Plan Configuration and set type for reducers
export const updateApiPlanConfigDataSuccess = response => ({
  type: UPDATE_API_PLAN_CONFIG_DATA_SUCCESS,
  payload: response
});

//action for set failure and error to UPDATE Api Plan Configuration and set type for reducers
export const updateApiPlanConfigDataFailure = error => ({
  type: UPDATE_API_PLAN_CONFIG_DATA_FAILURE,
  payload: error
});

//action for Api Plan Configuration and set type for reducers
export const getApiPlanConfigList = Data => ({
  type: GET_API_PLAN_CONFIG_LIST,
  payload: { Data }
});

//action for set Success and Api Plan Configuration and set type for reducers
export const getApiPlanConfigListSuccess = response => ({
  type: GET_API_PLAN_CONFIG_LIST_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Api Plan Configuration and set type for reducers
export const getApiPlanConfigListFailure = error => ({
  type: GET_API_PLAN_CONFIG_LIST_FAILURE,
  payload: error
});

//action for Get Rest Methods Read ONly and set type for reducers
export const getRestMethodReadOnly = Data => ({
  type: GET_REST_METHOD_READ_ONLY,
  payload: { Data }
});

//action for set Success and Get Rest Methods Read ONly and set type for reducers
export const getRestMethodReadOnlySuccess = response => ({
  type: GET_REST_METHOD_READ_ONLY_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Get Rest Methods Read ONly and set type for reducers
export const getRestMethodReadOnlyFailure = error => ({
  type: GET_REST_METHOD_READ_ONLY_FAILURE,
  payload: error
});

//action for Get Rest Methods Full Access and set type for reducers
export const getRestMethodFullAccess = Data => ({
  type: GET_REST_METHOD_FULL_ACCESS,
  payload: { Data }
});

//action for set Success and Get Rest Methods Full Access and set type for reducers
export const getRestMethodFullAccessSuccess = response => ({
  type: GET_REST_METHOD_FULL_ACCESS_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Get Rest Methods Full Access and set type for reducers
export const getRestMethodFullAccessFailure = error => ({
  type: GET_REST_METHOD_FULL_ACCESS_FAILURE,
  payload: error
});

//action for enable/disable plan and set type for reducers
export const enableDisableAPIPlan = Data => ({
  type: ENABLE_DISABLE_API_PLAN,
  payload: { Data }
});

//action for set Success and enable/disable plan and set type for reducers
export const enableDisableAPIPlanSuccess = response => ({
  type: ENABLE_DISABLE_API_PLAN_SUCCESS,
  payload: response.Response
});

//action for set failure and error to enable/disable plan and set type for reducers
export const enableDisableAPIPlanFailure = error => ({
  type: ENABLE_DISABLE_API_PLAN_FAILURE,
  payload: error
});