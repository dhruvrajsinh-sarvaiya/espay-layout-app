// Dev: Devang Parekh 
// Date : 6-3-2019
// action For get leverage detail for margin trading dashboard ()

// import types
import {
  GET_LEVERAGE_DETAIL,
  GET_LEVERAGE_DETAIL_SUCCESS,
  GET_LEVERAGE_DETAIL_FAILURE
} from "Actions/types";

//action for  leverage request call
export const getLeverageDetail = payload => ({
  type: GET_LEVERAGE_DETAIL,
  payload: payload
});

//action for set success data and pass into reducer
export const getLeverageDetailSuccess = response => ({
  type: GET_LEVERAGE_DETAIL_SUCCESS,
  payload: response
});

//action for set failure data and pass into reducer
export const getLeverageDetailFailure = error => ({
  type: GET_LEVERAGE_DETAIL_FAILURE,
  payload: error
});
