// Actions For Order Summary Data By Tejas

// import types
import {
  GET_ORDER_SUMMARY_DATA,
  GET_ORDER_SUMMARY_DATA_SUCCESS,
  GET_ORDER_SUMMARY_DATA_FAILURE
} from "Actions/types";

//action for ge Order Summary and set type for reducers
export const getOrderSummaryData = Pair => ({
  type: GET_ORDER_SUMMARY_DATA,
  payload: { Pair }
});

//action for set Success and Order Summary and set type for reducers
export const getOrderSummarySuccess = response => ({
  type: GET_ORDER_SUMMARY_DATA_SUCCESS,
  payload: response.data
});

//action for set failure and error to Order Summary and set type for reducers
export const getOrderSummaryFailure = error => ({
  type: GET_ORDER_SUMMARY_DATA_FAILURE,
  payload: error
});
