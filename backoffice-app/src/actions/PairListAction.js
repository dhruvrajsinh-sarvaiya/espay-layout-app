// import neccessary action types
import {
  GET_PAIR_LIST,
  GET_PAIR_LIST_SUCCESS,
  GET_PAIR_LIST_FAILURE,
  GET_CURRENCY_LIST,
  GET_CURRENCY_LIST_SUCCESS,
  GET_CURRENCY_LIST_FAILURE,
  ORGLIST,
  ORGLIST_SUCCESS,
  ORGLIST_FAIL,
  GET_WALLET_TYPE_MASTER,
  GET_WALLET_TYPE_MASTER_SUCCESS,
  GET_WALLET_TYPE_MASTER_FAILURE,
  GET_WALLET_TYPE,
  GET_WALLET_TYPE_SUCCESS,
  GET_WALLET_TYPE_FAILURE,
  GET_ROLE_DETAILS,
  GET_ROLE_DETAILS_SUCCESS,
  GET_ROLE_DETAILS_FAILURE,
  GET_WALLET_TRANSACTION_TYPE,
  GET_WALLET_TRANSACTION_TYPE_SUCCESS,
  GET_WALLET_TRANSACTION_TYPE_FAILURE,
  FETCH_BALANCE,
  FETCH_WALLET_LIST,
  FETCH_WALLET_LIST_SUCCESS,
  FETCH_WALLET_LIST_FAILURE,
  GET_USER_DATA,
  GET_USER_DATA_SUCCESS,
  GET_USER_DATA_FAILURE,
  GET_PROVIDER_LIST,
  GET_PROVIDER_LIST_SUCCESS,
  GET_PROVIDER_LIST_FAILURE,
  GET_REFERRAL_SERVICE,
  GET_REFERRAL_SERVICE_SUCCESS,
  GET_REFERRAL_SERVICE_FAILURE,
  GET_REFERRAL_PAYTYPE,
  GET_REFERRAL_PAYTYPE_SUCCESS,
  GET_REFERRAL_PAYTYPE_FAILURE,
  GET_REFERRAL_CHANNEL_TYPE,
  GET_REFERRAL_CHANNEL_TYPE_SUCCESS,
  GET_REFERRAL_CHANNEL_TYPE_FAILURE,
  GET_SITE_TOKEN,
  GET_SITE_TOKEN_SUCCESS,
  GET_SITE_TOKEN_FAILURE,
  GET_BASE_CURRENCY_LIST,
  GET_BASE_CURRENCY_LIST_SUCCESS,
  GET_BASE_CURRENCY_LIST_FAILURE,
  LIST_MARGIN_WALLETS,
  LIST_MARGIN_WALLETS_SUCCESS,
  LIST_MARGIN_WALLETS_FAILURE,
  COIN_SELECT_CLEAR,
  CLEAR_PAIR_LIST,

  AFFILIATE_USER_DATA,
  AFFILIATE_USER_DATA_SUCCESS,
  AFFILIATE_USER_DATA_FAILURE,
  GET_ARBITRAGE_PROVIDER_LIST,
  GET_ARBITRAGE_PROVIDER_LIST_FAILURE,
  GET_ARBITRAGE_PROVIDER_LIST_SUCCESS,
  GET_ARBITRAGE_CURRENCY_LIST,
  GET_ARBITRAGE_CURRENCY_LIST_SUCCESS,
  GET_ARBITRAGE_CURRENCY_LIST_FAILURE,
  GET_PROVIDER_WALLET_LIST,
  GET_PROVIDER_WALLET_LIST_SUCCESS,
  GET_PROVIDER_WALLET_LIST_FAILURE,
  GET_PROVIDER_ADDRESS_LIST,
  GET_PROVIDER_ADDRESS_LIST_SUCCESS,
  GET_PROVIDER_ADDRESS_LIST_FAILURE,
  LIST_PAIR_ARBITRAGE,
  LIST_PAIR_ARBITRAGE_FAILURE,
  LIST_PAIR_ARBITRAGE_SUCCESS,
  ARBITRGAE_BASE_MARKET,
  ARBITRGAE_BASE_MARKET_SUCCESS,
  ARBITRGAE_BASE_MARKET_FAILURE,
  GET_CHATUSERLIST,
  GET_CHATUSERLIST_SUCCESS,
  GET_CHATUSERLIST_FAILURE,
  GET_ALL_THIRD_PARTY_RESPONSE,
  GET_ALL_THIRD_PARTY_RESPONSE_SUCCESS,
  GET_ALL_THIRD_PARTY_RESPONSE_FAILURE,
  GET_API_PLAN_CONFIG_LIST,
  GET_API_PLAN_CONFIG_LIST_SUCCESS,
  GET_API_PLAN_CONFIG_LIST_FAILURE,
  GET_APP_TYPE,
  GET_APP_TYPE_SUCCESS,
  GET_APP_TYPE_FAILURE,
} from "./ActionTypes";

import { action } from "./GlobalActions";

//To Clear Reducer
export const clearReducer = () => ({
  type: COIN_SELECT_CLEAR
});

export function affiliateUserData() { return action(AFFILIATE_USER_DATA); }

export function affiliateUserDataSuccess(data) { return action(AFFILIATE_USER_DATA_SUCCESS, { data }); }

export function affiliateUserDataFailure() { return action(AFFILIATE_USER_DATA_FAILURE); }


export function getPairList(payload) { return action(GET_PAIR_LIST, { payload }); }

export function pairListSuccess(payload) { return action(GET_PAIR_LIST_SUCCESS, { payload }); }

export function pairListFailure(error) { return action(GET_PAIR_LIST_FAILURE, { error }); }

export function clearPairList() { return action(CLEAR_PAIR_LIST); }

//To get currency list
export function getCurrencyList() { return action(GET_CURRENCY_LIST); }

export function getCurrencyListSuccess(payload) { return action(GET_CURRENCY_LIST_SUCCESS, { payload }); }

export function getCurrencyListFailure() { return action(GET_CURRENCY_LIST_FAILURE); }

// Get Organization List
export function getOrgList() { return action(ORGLIST) }

// Get Organization List - Success
export function getOrgListSuccess(payload) { return action(ORGLIST_SUCCESS, { payload }) }

// Get Organization List - Fail
export function getOrgListFail(payload) { return action(ORGLIST_FAIL, { payload }) }

//Get Wallet Type Master
export function getWalletTypeMaster() { return action(GET_WALLET_TYPE_MASTER) }

// Get Wallet Type Master - success
export function getWalletTypeMasterSuccess(payload) { return action(GET_WALLET_TYPE_MASTER_SUCCESS, { payload }) }

// Get Wallet Type Master - success
export function getWalletTypeMasterFailure(payload) { return action(GET_WALLET_TYPE_MASTER_FAILURE, { payload }) }

export function getWalletType(payload = {}) { return action(GET_WALLET_TYPE, { payload }) }

export function getWalletTypeSuccess(payload) { return action(GET_WALLET_TYPE_SUCCESS, { payload }) }

export function getWalletTypeFailure(payload) { return action(GET_WALLET_TYPE_FAILURE, { payload }) }

//for get roles
export function getRoleDetails() { return action(GET_ROLE_DETAILS) }

export function getRoleDetailsSuccess(payload) { return action(GET_ROLE_DETAILS_SUCCESS, { payload }) }

export function getRoleDetailsFailure(payload) { return action(GET_ROLE_DETAILS_FAILURE, { payload }) }

//get trasancation type 
export function getWalletTransactionType() { return action(GET_WALLET_TRANSACTION_TYPE) }

export function getWalletTransactionTypeSuccess(payload) { return action(GET_WALLET_TRANSACTION_TYPE_SUCCESS, { payload }) }

export function getWalletTransactionTypeFailure(payload) { return action(GET_WALLET_TRANSACTION_TYPE_FAILURE, { payload }) }

// Call this function When GetBalance Api Call
export function GetBalance() {
  return action(FETCH_BALANCE)
}

// get wallet list
export function getWallets() {
  /* for loading */
  return action(FETCH_WALLET_LIST)
}
// success
export function getWalletsSuccess(data) {
  return action(FETCH_WALLET_LIST_SUCCESS, { data })
}
// failure
export function getWalletsFailure() {
  /* for failure call */
  return action(FETCH_WALLET_LIST_FAILURE)
}

// Get User Data
export function getUserDataList() {
  /* for loading */
  return action(GET_USER_DATA)
}
// Get User Data Success
export function getUserDataListSuccess(payload) {
  return action(GET_USER_DATA_SUCCESS, { payload })
}
// Get User Data Failure
export function getUserDataListFailure(payload) {
  /* for failure call */
  return action(GET_USER_DATA_FAILURE, { payload })
}

// get Provider list
export function getProviderList() {
  /* for loading */
  return action(GET_PROVIDER_LIST)
}
// get daemon addresses success
export function getProviderListSuccess(payload) {
  return action(GET_PROVIDER_LIST_SUCCESS, { payload })
}
// get daemon addresses failure
export function getProviderListFailure(payload) {
  /* for failure call */
  return action(GET_PROVIDER_LIST_FAILURE, { payload })
}

// get Referral Service
export function getReferralService(payload) {
  return action(GET_REFERRAL_SERVICE, { payload })
}
// get Referral Service success
export function getReferralServiceSuccess(payload) {
  return action(GET_REFERRAL_SERVICE_SUCCESS, { payload })
}
// get Referral Service failure
export function getReferralServiceFailure(payload) {
  return action(GET_REFERRAL_SERVICE_FAILURE, { payload })
}

// get Referral paytype
export function getReferralPaytype() {
  return action(GET_REFERRAL_PAYTYPE)
}
// get Referral paytype success
export function getReferralPaytypeSuccess(payload) {
  return action(GET_REFERRAL_PAYTYPE_SUCCESS, { payload })
}
// get Referral paytype failure
export function getReferralPaytypeFailure(payload) {
  return action(GET_REFERRAL_PAYTYPE_FAILURE, { payload })
}

// get Referral Channel Type
export function getReferralChannelType() {
  return action(GET_REFERRAL_CHANNEL_TYPE)
}
// get Referral Channel Type success
export function getReferralChannelTypeSuccess(payload) {
  return action(GET_REFERRAL_CHANNEL_TYPE_SUCCESS, { payload })
}
// get Referral Channel Type failure
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

// For Get Base Currency 
export const getBaseCurrencyList = currencyListRequest => ({
  type: GET_BASE_CURRENCY_LIST,
  payload: currencyListRequest
});

//For Get Base Currency Success
export const getBaseCurrencyListSuccess = Response => ({
  type: GET_BASE_CURRENCY_LIST_SUCCESS,
  payload: Response
});

//For Get Base Currency Failure
export const getBaseCurrencyListFailure = error => ({
  type: GET_BASE_CURRENCY_LIST_FAILURE,
  payload: error
});

// For List Margin Wallet
export const getMarginWalletList = (request) => ({
  type: LIST_MARGIN_WALLETS,
  request: request
});

// For List Margin Wallet Success
export const getMarginWalletListSuccess = (response) => ({
  type: LIST_MARGIN_WALLETS_SUCCESS,
  payload: response
});

// For List Margin Wallet Failure
export const getMarginWalletListFailure = (error) => ({
  type: LIST_MARGIN_WALLETS_FAILURE,
  payload: error
});

//for arbitrage provider list
export function getArbitrageProviderList(payload) { return action(GET_ARBITRAGE_PROVIDER_LIST, { payload }) }

export function getArbitrageProviderListSuccess(payload) { return action(GET_ARBITRAGE_PROVIDER_LIST_SUCCESS, { payload }) }

export function getArbitrageProviderListFailure() { return action(GET_ARBITRAGE_PROVIDER_LIST_FAILURE) }

//for arbitrage currency list
export function getArbitrageCurrencyList(payload = {}) { return action(GET_ARBITRAGE_CURRENCY_LIST, { payload }) }

export function getArbitrageCurrencyListSuccess(payload) { return action(GET_ARBITRAGE_CURRENCY_LIST_SUCCESS, { payload }) }

export function getArbitrageCurrencyListFailure() { return action(GET_ARBITRAGE_CURRENCY_LIST_FAILURE) }

// Redux action for Get Provider Address List
export function getProviderAddressList(payload = {}) { return action(GET_PROVIDER_ADDRESS_LIST, { payload }) }

// Redux action for Get Provider Address List Success
export function getProviderAddressListSuccess(payload) { return action(GET_PROVIDER_ADDRESS_LIST_SUCCESS, { payload }) }

// Redux action for Get Provider Address List Failure
export function getProviderAddressListFailure() { return action(GET_PROVIDER_ADDRESS_LIST_FAILURE) }

// Redux action for Get Provider Wallet List
export function getProviderWalletList(payload = {}) {
  return action(GET_PROVIDER_WALLET_LIST, { payload })
}

// Redux action for Get Provider Wallet List Success
export function getProviderWalletListSuccess(data) {
  return action(GET_PROVIDER_WALLET_LIST_SUCCESS, { data })
}

// Redux action for Get Provider Wallet List Failure
export function getProviderWalletListFailure() {
  return action(GET_PROVIDER_WALLET_LIST_FAILURE)
}

export function getListPairArbitrage(payload = {}) { return action(LIST_PAIR_ARBITRAGE, { payload }) }

export function getListPairArbitrageSuccess(payload) { return action(LIST_PAIR_ARBITRAGE_SUCCESS, { payload }) }

export function getListPairArbitrageFailure(payload) { return action(LIST_PAIR_ARBITRAGE_FAILURE, { payload }) }

export function getBaseMarketArbitrage(payload = {}) { return action(ARBITRGAE_BASE_MARKET, { payload }) }

export function getBaseMarketArbitrageSuccess(payload) { return action(ARBITRGAE_BASE_MARKET_SUCCESS, { payload }) }

export function getBaseMarketArbitrageFailure(payload) { return action(ARBITRGAE_BASE_MARKET_FAILURE, { payload }) }

export function getThirdPartyApiResponse(payload = {}) { return action(GET_ALL_THIRD_PARTY_RESPONSE, { payload }) }

export function getThirdPartyApiResponseSuccess(payload) { return action(GET_ALL_THIRD_PARTY_RESPONSE_SUCCESS, { payload }) }

export function getThirdPartyApiResponseFailure(payload) { return action(GET_ALL_THIRD_PARTY_RESPONSE_FAILURE, { payload }) }

export function getAppType(payload = {}) { return action(GET_APP_TYPE, { payload }) }

export function getAppTypeSuccess(payload) { return action(GET_APP_TYPE_SUCCESS, { payload }) }

export function getAppTypeFailure(payload) { return action(GET_APP_TYPE_FAILURE, { payload }) }

// Function for Get chat user list Data Action
export const getChatUserList = () => ({
  type: GET_CHATUSERLIST,
});

// Function for Get  chat user list Data Success Action
export const getChatUserListSuccess = (response) => ({
  type: GET_CHATUSERLIST_SUCCESS,
  payload: response
});

// Function for Get chat user list Data Failure Action
export const getChatUserListFailure = (error) => ({
  type: GET_CHATUSERLIST_FAILURE,
  payload: error
});

// Redux action for Get Api Plan Configuration List
export function getApiPlanConfigList() {
  return action(GET_API_PLAN_CONFIG_LIST)
}

// Redux action for Get Api Plan Configuration List Success
export function getApiPlanConfigListSuccess(data) {
  return action(GET_API_PLAN_CONFIG_LIST_SUCCESS, { data })
}

// Redux action for Get Api Plan Configuration List Failure
export function getApiPlanConfigListFailure() {
  return action(GET_API_PLAN_CONFIG_LIST_FAILURE)
}