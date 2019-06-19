// Actions For Manage Markets By Tejas

// import types
import {
  GET_MARKET_LIST,
  GET_MARKET_LIST_SUCCESS,
  GET_MARKET_LIST_FAILURE,
  ADD_MARKET_LIST,
  ADD_MARKET_LIST_SUCCESS,
  ADD_MARKET_LIST_FAILURE,
  UPDATE_MARKET_LIST,
  UPDATE_MARKET_LIST_SUCCESS,
  UPDATE_MARKET_LIST_FAILURE,
  DELETE_MARKET_LIST,
  DELETE_MARKET_LIST_SUCCESS,
  DELETE_MARKET_LIST_FAILURE
} from "Actions/types";

//action for Get manage markets and set type for reducers
export const getMarketList = Data => ({
  type: GET_MARKET_LIST,
  payload: { Data }
});

//action for set Success and Get manage markets and set type for reducers
export const getMarketListSuccess = response => ({
  type: GET_MARKET_LIST_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Get manage markets and set type for reducers
export const getMarketListFailure = error => ({
  type: GET_MARKET_LIST_FAILURE,
  payload: error
});

//action for add manage markets and set type for reducers
export const addMarketList = Data => ({
  type: ADD_MARKET_LIST,
  payload: { Data }
});

//action for set Success and add manage markets and set type for reducers
export const addMarketListSuccess = response => ({
  type: ADD_MARKET_LIST_SUCCESS,
  payload: response
});

//action for set failure and error to add manage markets and set type for reducers
export const addMarketListFailure = error => ({
  type: ADD_MARKET_LIST_FAILURE,
  payload: error
});

//action for UPDATE manage markets and set type for reducers
export const updateMarketList = Data => ({ 
  type: UPDATE_MARKET_LIST,
  payload: { Data }
});

//action for set Success and UPDATE manage markets and set type for reducers
export const updateMarketListSuccess = response => ({
  type: UPDATE_MARKET_LIST_SUCCESS,
  payload: response.Response
});

//action for set failure and error to UPDATE manage markets and set type for reducers
export const updateMarketListFailure = error => ({
  type: UPDATE_MARKET_LIST_FAILURE,
  payload: error
});

//action for delete manage markets and set type for reducers
export const deleteMarketList = Data => ({
  type: DELETE_MARKET_LIST,
  payload: { Data }
});

//action for set Success and delete manage markets and set type for reducers
export const deleteMarketListSuccess = response => ({
  type: DELETE_MARKET_LIST_SUCCESS,
  payload: response.data
});

//action for set failure and error to delete manage markets and set type for reducers
export const deleteMarketListFailure = error => ({
  type: DELETE_MARKET_LIST_FAILURE,
  payload: error.message
});
