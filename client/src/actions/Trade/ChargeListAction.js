// Actions For Get Charges list By Tejas Date :6/2/2019

// import types
import {
    GET_CHARGES_LIST,
    GET_CHARGES_LIST_SUCCESS,
    GET_CHARGES_LIST_FAILURE
  } from "Actions/types";
  
  //action for Get Charges list and set type for reducers
  export const getChargeList = payload => ({
    type: GET_CHARGES_LIST,
    payload: payload
  });
  
  //action for set Success and data to Get Charges list and set type for reducers
  export const getChargeListSuccess = response => ({
    type: GET_CHARGES_LIST_SUCCESS,
    payload: response.Data
  });
  
  //action for set failure and error to Get Charges list and set type for reducers
  export const getChargeListFailure = error => ({
    type: GET_CHARGES_LIST_FAILURE,
    payload: error
  });
  