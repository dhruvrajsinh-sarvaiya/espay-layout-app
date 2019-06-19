// Actions For Trade Chart Data By Tejas Date:7/1/2019

// import types
import {
    GET_CHART_DATA,
    GET_CHART_DATA_SUCCESS,
    GET_CHART_DATA_FAILURE
  } from "Actions/types";
  
  //action for Chart Data List and set type for reducers
  export const getChartDataList = Pair => ({
    type: GET_CHART_DATA,
    payload: { Pair }
  });
  
  //action for set Success and Chart Data List and set type for reducers
  export const getChartDataListSuccess = response => ({
    type: GET_CHART_DATA_SUCCESS,
    payload: response.response
  });
  
  //action for set failure and error to Chart Data List and set type for reducers
  export const getChartDataListFailure = error => ({
    type: GET_CHART_DATA_FAILURE,
    payload: error.message
  });
  