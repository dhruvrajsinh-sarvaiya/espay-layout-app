// Actions For Api Request By Tejas

// import types
import {

  ADD_API_REQUEST_LIST,
  ADD_API_REQUEST_LIST_SUCCESS,
  ADD_API_REQUEST_LIST_FAILURE,
  UPDATE_API_REQUEST_LIST,
  UPDATE_API_REQUEST_LIST_SUCCESS,
  UPDATE_API_REQUEST_LIST_FAILURE,
  GET_APP_TYPE_LIST,
  GET_APP_TYPE_LIST_SUCCESS,
  GET_APP_TYPE_LIST_FAILURE,
} from "Actions/types";

//action for add Api Response and set type for reducers
export const addThirdPartyApiRequestList = Data => ({
  type: ADD_API_REQUEST_LIST,
  payload: { Data }
});

//action for set Success and add Api Response and set type for reducers
export const addThirdPartyApiRequestListSuccess = response => ({
  type: ADD_API_REQUEST_LIST_SUCCESS,
  payload: response
});

//action for set failure and error to add Api Response and set type for reducers
export const addThirdPartyApiRequestListFailure = error => ({
  type: ADD_API_REQUEST_LIST_FAILURE,
  payload: error
});

//action for UPDATE Api Response and set type for reducers
export const updateThirdPartyApiRequestList = Data => ({
  type: UPDATE_API_REQUEST_LIST,
  payload: { Data }
});

//action for set Success and UPDATE Api Response and set type for reducers
export const updateThirdPartyApiRequestListSuccess = response => ({
  type: UPDATE_API_REQUEST_LIST_SUCCESS,
  payload: response
});

//action for set failure and error to UPDATE Api Response and set type for reducers
export const updateThirdPartyApiRequestListFailure = error => ({
  type: UPDATE_API_REQUEST_LIST_FAILURE,
  payload: error
});

//action for Api Response and set type for reducers
export const getAppTypeList = Data => ({
  type: GET_APP_TYPE_LIST,
  payload: { Data }
});

//action for set Success and Api Response and set type for reducers
export const getAppTypeListSuccess = response => ({
  type: GET_APP_TYPE_LIST_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Api Response and set type for reducers
export const getAppTypeListFailure = error => ({
  type: GET_APP_TYPE_LIST_FAILURE,
  payload: error
});

