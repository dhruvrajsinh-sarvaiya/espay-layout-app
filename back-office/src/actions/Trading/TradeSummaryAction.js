// Actions For Trade Summary Total By Tejas

// import types
import {
    GET_TRADE_SUMMARY_TOTAL_DATA,
    GET_TRADE_SUMMARY_TOTAL_DATA_SUCCESS,
    GET_TRADE_SUMMARY_TOTAL_DATA_FAILURE
  } from "Actions/types";
  
  //action for Trade Summary Total List and set type for reducers
  export const getTradeSummaryTotalData = Data => ({
    type: GET_TRADE_SUMMARY_TOTAL_DATA,
    payload: { Data }
  });
  
  //action for set Success and Trade Summary Total List and set type for reducers
  export const getTradeSummaryTotalDataSuccess = response => ({
    type: GET_TRADE_SUMMARY_TOTAL_DATA_SUCCESS,
    payload: response.data
  });
  
  //action for set failure and error to Trade Summary Total List and set type for reducers
  export const getTradeSummaryTotalDataFailure = error => ({
    type: GET_TRADE_SUMMARY_TOTAL_DATA_FAILURE,
    payload: error.message
  });
  