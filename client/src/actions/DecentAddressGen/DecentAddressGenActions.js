/* 
    Developer : Nishant Vadgama
    Date : 01-10-2018
    File Comment : Decentralize Address Generation actions
*/

import {
  GET_CURRENCY,
  GET_CURRENCY_SUCCESS,
  GET_CURRENCY_FAILURE,
  DECENT_ADDRESS_GENERATION,
  DECENT_ADDRESS_GEN_SUCCESS,
  DECENT_ADDRESS_GEN_FAILURE
} from "../types";

// get currency list
export const getCurrency = () => ({
  type: GET_CURRENCY
});
// get currency list success
export const getCurrencySuccess = payload => ({
  type: GET_CURRENCY_SUCCESS,
  payload: payload.data
});
// get currency list failure
export const getCurrencyFailure = error => ({
  type: GET_CURRENCY_FAILURE,
  error: error
});

// post form data
export const genAddressRequest = request => ({
  type: DECENT_ADDRESS_GENERATION,
  payload: request
});
// generate address request success
export const genAddressRequestSuccess = response => ({
  type: DECENT_ADDRESS_GEN_SUCCESS,
  payload: response.data
});
// generate address request failure
export const genAddressRequestFailure = error => ({
  type: DECENT_ADDRESS_GEN_FAILURE,
  error: error
});
