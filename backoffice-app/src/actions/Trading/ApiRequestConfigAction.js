// Actions For Api Request

// import types
import {
  //add api request
  ADD_API_REQUEST_LIST,
  ADD_API_REQUEST_LIST_SUCCESS,
  ADD_API_REQUEST_LIST_FAILURE,
  ADD_API_REQUEST_LIST_CLEAR,

  //update api request
  UPDATE_API_REQUEST_LIST,
  UPDATE_API_REQUEST_LIST_SUCCESS,
  UPDATE_API_REQUEST_LIST_FAILURE,
  UPDATE_API_REQUEST_LIST_CLEAR,
} from "../ActionTypes";

//action for add Api Response and set type for reducers
export const addThirdPartyApiRequestList = requestUpdateThirdPartyApi => ({
  type: ADD_API_REQUEST_LIST,
  payload: { requestUpdateThirdPartyApi }
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
export const updateThirdPartyApiRequestList = requestUpdateThirdPartyApi => ({
  type: UPDATE_API_REQUEST_LIST,
  payload: { requestUpdateThirdPartyApi }
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

//action for clear Add Data
export const clearAddData = () => ({
  type: ADD_API_REQUEST_LIST_CLEAR,
});

//action for clear Update Data
export const clearUpdateData = () => ({
  type: UPDATE_API_REQUEST_LIST_CLEAR,
});

