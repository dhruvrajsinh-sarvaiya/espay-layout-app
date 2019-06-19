/**
 * Auther : Salim Deraiya
 * Created : 23-10-2019
 * Historical Performance Actions
 */

import {
    //Get Historical Performance Chart Data
    GET_HISTORICAL_PERFORMANCE_CHART_DATA,
    GET_HISTORICAL_PERFORMANCE_CHART_DATA_SUCCESS,
    GET_HISTORICAL_PERFORMANCE_CHART_DATA_FAILURE,

  } from "../types";
  
  /**
   * Redux Action To Get Historical Performance Chart Data
   */
  export const getHistoricalPerformanceChartData = (data) => ({
    type: GET_HISTORICAL_PERFORMANCE_CHART_DATA,
    payload: data
  });
  
  /**
   * Redux Action To Get Historical Performance Chart Data Success
   */
  export const getHistoricalPerformanceChartDataSuccess = (data) => ({
    type: GET_HISTORICAL_PERFORMANCE_CHART_DATA_SUCCESS,
    payload: data
  });
  
  /**
   * Redux Action To Get Historical Performance Chart Data Failure
   */
  export const getHistoricalPerformanceChartDataFailure = (error) => ({
    type: GET_HISTORICAL_PERFORMANCE_CHART_DATA_FAILURE,
    payload: error
  });