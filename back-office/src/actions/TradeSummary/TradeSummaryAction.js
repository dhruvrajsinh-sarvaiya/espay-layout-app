// Actions For Trade Summary By Tejas

// import types
import {
  GET_TRADE_SUMMARY_LIST,
  GET_TRADE_SUMMARY_LIST_SUCCESS,
  GET_TRADE_SUMMARY_LIST_FAILURE
} from "Actions/types";

//action for TRADE_Summary List and set type for reducers
export const getTradeSummaryList = Data => ({
  type: GET_TRADE_SUMMARY_LIST,
  payload: { Data }
});

//action for set Success and TRADE_Summary List and set type for reducers
export const getTradeSummaryListSuccess = response => ({
  type: GET_TRADE_SUMMARY_LIST_SUCCESS,
  payload: response
});

//action for set failure and error to TRADE_Summary List and set type for reducers
export const getTradeSummaryListFailure = error => ({
  type: GET_TRADE_SUMMARY_LIST_FAILURE,
  payload: error
});
