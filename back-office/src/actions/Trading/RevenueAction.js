// Actions For Revenue Data By Tejas

// import types
import {
    GET_REVENUE_DATA,
    GET_REVENUE_DATA_SUCCESS,
    GET_REVENUE_DATA_FAILURE
  } from "Actions/types";
  
  //action for Revenue Data List and set type for reducers
  export const getRevenueDataList = Data => ({
    type: GET_REVENUE_DATA,
    payload: { Data }
  });
  
  //action for set Success and Revenue Data List and set type for reducers
  export const getRevenueDataListSuccess = response => ({
    type: GET_REVENUE_DATA_SUCCESS,
    payload: response.data
  });
  
  //action for set failure and error to Revenue Data List and set type for reducers
  export const getRevenueDataListFailure = error => ({
    type: GET_REVENUE_DATA_FAILURE,
    payload: error.message
  });
  