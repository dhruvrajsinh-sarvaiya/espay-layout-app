// Actions For Trade Chart Data By Tejas Date :25/9/2018

// import types
import {
  GET_CHART_DATA,
  GET_CHART_DATA_SUCCESS,
  GET_CHART_DATA_FAILURE,
  GET_MARKET_DEPTH,
  GET_MARKET_DEPTH_SUCCESS,
  GET_MARKET_DEPTH_FAILURE
} from "Actions/types";

//action for geChart Data and set type for reducers
export const getChartData = payload => ({
  type: GET_CHART_DATA,
  payload:  payload 
});

//action for set Success and Chart Data and set type for reducers
export const getChartDataSuccess = response => ({
  type: GET_CHART_DATA_SUCCESS,
  payload: response.response
});

//action for set failure and error to Chart Data and set type for reducers
export const getChartDataFailure = error => ({
  type: GET_CHART_DATA_FAILURE,
  payload: error
});

//action for Market Depth Data and set type for reducers By : Tejas Date : 12/1/2019
export const getMarketDepth = payload => ({
  type: GET_MARKET_DEPTH,
  payload:  payload 
});

//action for set Success and Market Depth Data and set type for reducers By : Tejas Date : 12/1/2019
export const getMarketDepthSuccess = response => ({
  type: GET_MARKET_DEPTH_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Market Depth Data and set type for reducers By : Tejas Date : 12/1/2019
export const getMarketDepthFailure = error => ({
  type: GET_MARKET_DEPTH_FAILURE,
  payload: error
});
