// Actions For Get Total Count Data By Tejas

// import types
import {
  GET_USER_TRADE_COUNT,
  GET_USER_TRADE_COUNT_SUCCESS,
  GET_USER_TRADE_COUNT_FAILURE,

  GET_CONFIGURATION_COUNT,
  GET_CONFIGURATION_COUNT_SUCCESS,
  GET_CONFIGURATION_COUNT_FAILURE,

  GET_TRADE_SUMMARY_COUNT,
  GET_TRADE_SUMMARY_COUNT_SUCCESS,
  GET_TRADE_SUMMARY_COUNT_FAILURE,

  GET_USER_MARKET_COUNT,
  GET_USER_MARKET_COUNT_SUCCESS,
  GET_USER_MARKET_COUNT_FAILURE,

  GET_REPORT_COUNT,
  GET_REPORT_COUNT_SUCCESS,
  GET_REPORT_COUNT_FAILURE,
} from "Actions/types";

//action for Get Total Count List and set type for reducers
export const getUserTradeCount = Data => ({
  type: GET_USER_TRADE_COUNT,
  payload: Data
});

//action for set Success and Get Total Count List and set type for reducers
export const getUserTradeCountSuccess = response => ({
  type: GET_USER_TRADE_COUNT_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Get Total Count List and set type for reducers
export const getUserTradeCountFailure = error => ({
  type: GET_USER_TRADE_COUNT_FAILURE,
  payload: error
});

//action for Get Total Count List and set type for reducers
export const getConfigurationCount = Data => ({
  type: GET_CONFIGURATION_COUNT,
  payload: Data
});

//action for set Success and Get Total Count List and set type for reducers
export const getConfigurationCountSuccess = response => ({
  type: GET_CONFIGURATION_COUNT_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Get Total Count List and set type for reducers
export const getConfigurationCountFailure = error => ({
  type: GET_CONFIGURATION_COUNT_FAILURE,
  payload: error
});

//action for Get Total Count List and set type for reducers
export const getTradeSummaryCount = Data => ({
  type: GET_TRADE_SUMMARY_COUNT,
  payload: Data
});

//action for set Success and Get Total Count List and set type for reducers
export const getTradeSummaryCountSuccess = response => ({
  type: GET_TRADE_SUMMARY_COUNT_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Get Total Count List and set type for reducers
export const getTradeSummaryCountFailure = error => ({
  type: GET_TRADE_SUMMARY_COUNT_FAILURE,
  payload: error
});

//action for Get Total Count List and set type for reducers
export const getUserMarketCount = Data => ({
  type: GET_USER_MARKET_COUNT,
  payload: { Data }
});

//action for set Success and Get Total Count List and set type for reducers
export const getUserMarketCountSuccess = response => ({
  type: GET_USER_MARKET_COUNT_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Get Total Count List and set type for reducers
export const getUserMarketCountFailure = error => ({
  type: GET_USER_MARKET_COUNT_FAILURE,
  payload: error
});

//action for Get Total Count List and set type for reducers
export const getReportCount = Data => ({
  type: GET_REPORT_COUNT,
  payload: { Data }
});

//action for set Success and Get Total Count List and set type for reducers
export const getReportCountSuccess = response => ({
  type: GET_REPORT_COUNT_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Get Total Count List and set type for reducers
export const getReportCountFailure = error => ({
  type: GET_REPORT_COUNT_FAILURE,
  payload: error
});