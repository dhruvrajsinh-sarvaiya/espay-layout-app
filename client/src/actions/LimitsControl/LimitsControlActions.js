/* 
    Developer : Nishant Vadgam
    Date : 25-09-2018
    File Comment : Limits Control Actions Methods
*/

import {
  // get wallet list
  GET_LC_WALLETS,
  GET_LC_WALLETS_SUCCESS,
  GET_LC_WALLETS_FAILURE,
  // get limit info
  GET_LIMITINFO,
  GET_LIMITINFO_SUCCES,
  GET_LIMITINFO_FAILURE,
  // set limit info
  POST_LIMITINFO,
  POST_LIMITINFO_SUCCESS,
  POST_LIMITINFO_FAILURE
} from "../types";

// get wallet list
export const getWallets = () => ({
  type: GET_LC_WALLETS
});
// success
export const getWalletsSuccess = response => ({
  type: GET_LC_WALLETS_SUCCESS,
  payload: response
});
// failure
export const getWalletsFailure = error => ({
  type: GET_LC_WALLETS_FAILURE,
  payload: error
});

// get limit info
export const getLimitInfo = walletId => ({
  type: GET_LIMITINFO,
  walletId: walletId
});
// get limit info success
export const getLimitInfoSuccess = payload => ({
  type: GET_LIMITINFO_SUCCES,
  payload: payload
});
// get limit info failure
export const getLimitInfoFailure = error => ({
  type: GET_LIMITINFO_FAILURE,
  error: error
});

// submit limit info
export const postLimitInfo = request => ({
  type: POST_LIMITINFO,
  request: request
});
// submit limit info success
export const postLimitInfoSuccess = payload => ({
  type: POST_LIMITINFO_SUCCESS,
  payload: payload
});
// submit limit info failure
export const postLimitInfoFailure = error => ({
  type: POST_LIMITINFO_FAILURE,
  error: error
});
