// import neccessary action types
import {
  // Get Pair List
  GET_PAIR_LIST,
  GET_PAIR_LIST_SUCCESS,
  GET_PAIR_LIST_FAILURE,

  // Get Currency List
  GET_CURRENCY_LIST,
  GET_CURRENCY_LIST_SUCCESS,
  GET_CURRENCY_LIST_FAILURE,

  // Org List
  ORGLIST,
  ORGLIST_SUCCESS,
  ORGLIST_FAIL,

  // Get Wallet Type Master
  GET_WALLET_TYPE_MASTER,
  GET_WALLET_TYPE_MASTER_SUCCESS,
  GET_WALLET_TYPE_MASTER_FAILURE,

  // Get Wallet Type
  GET_WALLET_TYPE,
  GET_WALLET_TYPE_SUCCESS,
  GET_WALLET_TYPE_FAILURE,

  // Get Role Details
  GET_ROLE_DETAILS,
  GET_ROLE_DETAILS_SUCCESS,
  GET_ROLE_DETAILS_FAILURE,

  // Get Wallet Transaction Type
  GET_WALLET_TRANSACTION_TYPE,
  GET_WALLET_TRANSACTION_TYPE_SUCCESS,
  GET_WALLET_TRANSACTION_TYPE_FAILURE,

  // Fetch Balance
  FETCH_BALANCE,

  // Fetch Wallet List
  FETCH_WALLET_LIST,
  FETCH_WALLET_LIST_SUCCESS,
  FETCH_WALLET_LIST_FAILURE,

  // Get User Data
  GET_USER_DATA,
  GET_USER_DATA_SUCCESS,
  GET_USER_DATA_FAILURE,

  // Get Provider List
  GET_PROVIDER_LIST,
  GET_PROVIDER_LIST_SUCCESS,
  GET_PROVIDER_LIST_FAILURE,

  // Get Referral Service
  GET_REFERRAL_SERVICE,
  GET_REFERRAL_SERVICE_SUCCESS,
  GET_REFERRAL_SERVICE_FAILURE,

  // Get Referral Paytype
  GET_REFERRAL_PAYTYPE,
  GET_REFERRAL_PAYTYPE_SUCCESS,
  GET_REFERRAL_PAYTYPE_FAILURE,

  // Get Referral Channel Type
  GET_REFERRAL_CHANNEL_TYPE,
  GET_REFERRAL_CHANNEL_TYPE_SUCCESS,
  GET_REFERRAL_CHANNEL_TYPE_FAILURE,

  // Get Site Token
  GET_SITE_TOKEN,
  GET_SITE_TOKEN_SUCCESS,
  GET_SITE_TOKEN_FAILURE,

  // Get Base Currency List
  GET_BASE_CURRENCY_LIST,
  GET_BASE_CURRENCY_LIST_SUCCESS,
  GET_BASE_CURRENCY_LIST_FAILURE,

  // List Margin Wallets
  LIST_MARGIN_WALLETS,
  LIST_MARGIN_WALLETS_SUCCESS,
  LIST_MARGIN_WALLETS_FAILURE,

  // Coin Select Clear
  COIN_SELECT_CLEAR,

  // Clear Pair List
  CLEAR_PAIR_LIST,
} from "./ActionTypes";

import { action } from "./GlobalActions";

//To Clear Reducer
export const clearReducer = () => ({
  type: COIN_SELECT_CLEAR
});

// Redux action to Get Pair List
export function getPairList() { return action(GET_PAIR_LIST); }

// Redux action to Get Pair List Success
export function pairListSuccess(payload) { return action(GET_PAIR_LIST_SUCCESS, { payload }); }

// Redux action to Get Pair List Failure
export function pairListFailure(error) { return action(GET_PAIR_LIST_FAILURE, { error }); }

// Redux action to Clear Pair List
export function clearPairList() { return action(CLEAR_PAIR_LIST); }

// Redux action to get currency list
export function getCurrencyList() { return action(GET_CURRENCY_LIST); }

// Redux action to get currency list success
export function getCurrencyListSuccess(payload) { return action(GET_CURRENCY_LIST_SUCCESS, { payload }); }

// Redux action to get currency list failure
export function getCurrencyListFailure() { return action(GET_CURRENCY_LIST_FAILURE); }

// Redux action to Get Organization List
export function getOrgList() { return action(ORGLIST) };

// Redux action to Get Organization List Success
export function getOrgListSuccess(payload) { return action(ORGLIST_SUCCESS, { payload }) };

// Redux action to Get Organization List Failure
export function getOrgListFail(payload) { return action(ORGLIST_FAIL, { payload }) };

// Redux action to Get Wallet Type Master
export function getWalletTypeMaster() { return action(GET_WALLET_TYPE_MASTER) };

// Redux action to Get Wallet Type Master - success
export function getWalletTypeMasterSuccess(payload) { return action(GET_WALLET_TYPE_MASTER_SUCCESS, { payload }) };

// Redux action to Get Wallet Type Master - failure
export function getWalletTypeMasterFailure(payload) { return action(GET_WALLET_TYPE_MASTER_FAILURE, { payload }) };

// Redux action to Get Wallet Type
export function getWalletType() { return action(GET_WALLET_TYPE) };

// Redux action to Get Wallet Type Success
export function getWalletTypeSuccess(payload) { return action(GET_WALLET_TYPE_SUCCESS, { payload }) };

// Redux action to Get Wallet Type Failure
export function getWalletTypeFailure(payload) { return action(GET_WALLET_TYPE_FAILURE, { payload }) };

// Redux action to Get Role Details
export function getRoleDetails() { return action(GET_ROLE_DETAILS) };

// Redux action to Get Role Details Success
export function getRoleDetailsSuccess(payload) { return action(GET_ROLE_DETAILS_SUCCESS, { payload }) };

// Redux action to Get Role Details Failure
export function getRoleDetailsFailure(payload) { return action(GET_ROLE_DETAILS_FAILURE, { payload }) };

// Redux action to get trasancation type
export function getWalletTransactionType() { return action(GET_WALLET_TRANSACTION_TYPE) };

// Redux action to get trasancation type success
export function getWalletTransactionTypeSuccess(payload) { return action(GET_WALLET_TRANSACTION_TYPE_SUCCESS, { payload }) };

// Redux action to get trasancation type failure
export function getWalletTransactionTypeFailure(payload) { return action(GET_WALLET_TRANSACTION_TYPE_FAILURE, { payload }) };

// Redux action to Get Balance
export function GetBalance() {
  return action(FETCH_BALANCE)
}

// Redux action to get wallet list
export function getWallets() {
  return action(FETCH_WALLET_LIST)
}

// Redux action to get wallet list success
export function getWalletsSuccess(data) {
  return action(FETCH_WALLET_LIST_SUCCESS, { data })
}

// Redux action to get wallet list failure 
export function getWalletsFailure() {
  return action(FETCH_WALLET_LIST_FAILURE)
}

// Redux action to Get User Data
export function getUserDataList() {
  return action(GET_USER_DATA)
}
// Redux action to Get User Data Success
export function getUserDataListSuccess(payload) {
  return action(GET_USER_DATA_SUCCESS, { payload })
}
// Redux action to Get User Data Failure
export function getUserDataListFailure(payload) {
  return action(GET_USER_DATA_FAILURE, { payload })
}

// Redux action to get Provider list
export function getProviderList() {
  return action(GET_PROVIDER_LIST)
}
// Redux action to get daemon addresses success
export function getProviderListSuccess(payload) {
  return action(GET_PROVIDER_LIST_SUCCESS, { payload })
}
// Redux action to get daemon addresses failure
export function getProviderListFailure(payload) {
  return action(GET_PROVIDER_LIST_FAILURE, { payload })
}

// Redux action to get Referral Service
export function getReferralService(payload) {
  return action(GET_REFERRAL_SERVICE, { payload })
}
// Redux action to get Referral Service success
export function getReferralServiceSuccess(payload) {
  return action(GET_REFERRAL_SERVICE_SUCCESS, { payload })
}
// Redux action to get Referral Service failure
export function getReferralServiceFailure(payload) {
  return action(GET_REFERRAL_SERVICE_FAILURE, { payload })
}

// Redux action to get Referral paytype
export function getReferralPaytype() {
  return action(GET_REFERRAL_PAYTYPE)
}
// Redux action to get Referral paytype success
export function getReferralPaytypeSuccess(payload) {
  return action(GET_REFERRAL_PAYTYPE_SUCCESS, { payload })
}
// Redux action to get Referral paytype failure
export function getReferralPaytypeFailure(payload) {
  return action(GET_REFERRAL_PAYTYPE_FAILURE, { payload })
}

// Redux action to get Referral Channel Type
export function getReferralChannelType() {
  return action(GET_REFERRAL_CHANNEL_TYPE)
}
// Redux action to get Referral Channel Type success
export function getReferralChannelTypeSuccess(payload) {
  return action(GET_REFERRAL_CHANNEL_TYPE_SUCCESS, { payload })
}
// Redux action to get Referral Channel Type failure
export function getReferralChannelTypeFailure(payload) {
  return action(GET_REFERRAL_CHANNEL_TYPE_FAILURE, { payload })
}

//action for Site Token Conversion and set type for reducers
export const getSiteToken = Data => ({
  type: GET_SITE_TOKEN,
  payload: { Data }
});

//action for set Success and Site Token Conversion and set type for reducers
export const getSiteTokenSuccess = response => ({
  type: GET_SITE_TOKEN_SUCCESS,
  payload: response
});

//action for set failure and error to Site Token Conversion and set type for reducers
export const getSiteTokenFailure = error => ({
  type: GET_SITE_TOKEN_FAILURE,
  payload: error
});

// Redux action to Get Base Currency 
export const getBaseCurrencyList = currencyListRequest => ({
  type: GET_BASE_CURRENCY_LIST,
  payload: currencyListRequest
});

// Redux action to Get Base Currency Success
export const getBaseCurrencyListSuccess = Response => ({
  type: GET_BASE_CURRENCY_LIST_SUCCESS,
  payload: Response
});

// Redux action to Get Base Currency Failure
export const getBaseCurrencyListFailure = error => ({
  type: GET_BASE_CURRENCY_LIST_FAILURE,
  payload: error
});

// Redux action to List Margin Wallet
export const getMarginWalletList = (request) => ({
  type: LIST_MARGIN_WALLETS,
  request: request
});

// Redux action to List Margin Wallet Success
export const getMarginWalletListSuccess = (response) => ({
  type: LIST_MARGIN_WALLETS_SUCCESS,
  payload: response
});

// Redux action to List Margin Wallet Failure
export const getMarginWalletListFailure = (error) => ({
  type: LIST_MARGIN_WALLETS_FAILURE,
  payload: error
});
