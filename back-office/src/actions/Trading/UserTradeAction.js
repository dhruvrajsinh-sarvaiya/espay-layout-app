// Actions For User Trade By Tejas

// import types
import {
    GET_USER_TRADE_DATA,
    GET_USER_TRADE_DATA_SUCCESS,
    GET_USER_TRADE_DATA_FAILURE,
    GET_USER_TRADE_TOTAL_DATA,
    GET_USER_TRADE_TOTAL_DATA_SUCCESS,
    GET_USER_TRADE_TOTAL_DATA_FAILURE
  } from "Actions/types";
  
  //action for User Trade List and set type for reducers
  export const getUserTradeDataList = Data => ({
    type: GET_USER_TRADE_DATA,
    payload: { Data }
  });
  
  //action for set Success and User Trade List and set type for reducers
  export const getUserTradeDataListSuccess = response => ({
    type: GET_USER_TRADE_DATA_SUCCESS,
    payload: response.data
  });
  
  //action for set failure and error to User Trade List and set type for reducers
  export const getUserTradeDataListFailure = error => ({
    type: GET_USER_TRADE_DATA_FAILURE,
    payload: error.message
  });
  
  //action for User Trade List Total and set type for reducers
  export const getUserTradeTotalData = Data => ({
    type: GET_USER_TRADE_TOTAL_DATA,
    payload: { Data }
  });
  
  //action for set Success and User Trade List Total and set type for reducers
  export const getUserTradeTotalDataSuccess = response => ({
    type: GET_USER_TRADE_TOTAL_DATA_SUCCESS,
    payload: response.data
  });
  
  //action for set failure and error to User Trade List Total and set type for reducers
  export const getUserTradeTotalDataFailure = error => ({
    type: GET_USER_TRADE_TOTAL_DATA_FAILURE,
    payload: error.message
  });
  