// Actions For Api Response By Tejas

// import types
import {
  GET_API_RESPONSE_LIST,
  GET_API_RESPONSE_LIST_SUCCESS,
  GET_API_RESPONSE_LIST_FAILURE,
  ADD_API_RESPONSE_LIST,
  ADD_API_RESPONSE_LIST_SUCCESS,
  ADD_API_RESPONSE_LIST_FAILURE,
  UPDATE_API_RESPONSE_LIST,
  UPDATE_API_RESPONSE_LIST_SUCCESS,
  UPDATE_API_RESPONSE_LIST_FAILURE,
} from "Actions/types";


//action for add Api Response and set type for reducers
export const getThirdPartyApiResponse = Data => ({
  type: GET_API_RESPONSE_LIST,
  payload: { Data }
});

//action for set Success and add Api Response and set type for reducers
export const getThirdPartyApiResponseSuccess = response => ({
  type: GET_API_RESPONSE_LIST_SUCCESS,
  payload: response.Response
});

//action for set failure and error to add Api Response and set type for reducers
export const getThirdPartyApiResponseFailure = error => ({
  type: GET_API_RESPONSE_LIST_FAILURE,
  payload: error
});

//action for add Api Response and set type for reducers
export const addThirdPartyApiResponseList = Data => ({
  type: ADD_API_RESPONSE_LIST,
  payload: { Data }
});

//action for set Success and add Api Response and set type for reducers
export const addThirdPartyApiResponseListSuccess = response => ({
  type: ADD_API_RESPONSE_LIST_SUCCESS,
  payload: response
});

//action for set failure and error to add Api Response and set type for reducers
export const addThirdPartyApiResponseListFailure = error => ({
  type: ADD_API_RESPONSE_LIST_FAILURE,
  payload: error
});

//action for UPDATE Api Response and set type for reducers
export const updateThirdPartyApiResponseList = Data => ({
  type: UPDATE_API_RESPONSE_LIST,
  payload: { Data }
});

//action for set Success and UPDATE Api Response and set type for reducers
export const updateThirdPartyApiResponseListSuccess = response => ({
  type: UPDATE_API_RESPONSE_LIST_SUCCESS,
  payload: response
});

//action for set failure and error to UPDATE Api Response and set type for reducers
export const updateThirdPartyApiResponseListFailure = error => ({
  type: UPDATE_API_RESPONSE_LIST_FAILURE,
  payload: error
});