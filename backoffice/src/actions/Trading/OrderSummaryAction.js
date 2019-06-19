// Actions For Order Summary Data By Tejas

// import types
import {
    GET_ORDER_SUMMARY_TOTAL_DATA,
    GET_ORDER_SUMMARY_TOTAL_DATA_SUCCESS,
    GET_ORDER_SUMMARY_TOTAL_DATA_FAILURE
  } from "Actions/types";
  
  //action for Order Summary Total Data List and set type for reducers
  export const getOrderSummaryTotalData = Data => ({
    type: GET_ORDER_SUMMARY_TOTAL_DATA,
    payload: { Data }
  });
  
  //action for set Success and Order Summary Total Data List and set type for reducers
  export const getOrderSummaryTotalDataSuccess = response => ({
    type: GET_ORDER_SUMMARY_TOTAL_DATA_SUCCESS,
    payload: response.data
  });
  
  //action for set failure and error to Order Summary Total Data List and set type for reducers
  export const getOrderSummaryTotalDataFailure = error => ({
    type: GET_ORDER_SUMMARY_TOTAL_DATA_FAILURE,
    payload: error.message
  });
  