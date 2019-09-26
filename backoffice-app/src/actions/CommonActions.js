import {
  // get wallets and balance,
  GET_AD_WALLETS,
  GET_AD_WALLETS_SUCCESS,
  GET_AD_WALLETS_FAILURE,
  //get defualt wallet address
  GET_DEFAULT_ADD,
  GET_DEFAULT_ADD_SUCCESS,
  GET_DEFAULT_ADD_FAILURE,
  GET_FEEANDLIMIT,
  GET_FEEANDLIMIT_SUCCESS,
  GET_FEEANDLIMIT_FAILURE,
  GET_AD_BALANCE,
  GET_AD_BALANCE_SUCCESS,
  GET_AD_BALANCE_FAILURE
} from './ActionTypes';

/* 
    Comment :Function for dispatch Get Address Action
*/
export const getWallets = (walletsRequest) => ({
  type: GET_AD_WALLETS,
  walletsRequest: walletsRequest,
});

/* 
  Comment :Function for dispatch Get Address Action for Success
*/
export const getWalletsSuccess = (response) => ({
  type: GET_AD_WALLETS_SUCCESS,
  payload: response
})

/* 
  Comment :Function for dispatch Get Address Action for Failure
*/
export const getWalletsFailure = (error) => ({
  type: GET_AD_WALLETS_FAILURE,
  payload: error
})

// GET DEFAULT ADDRESS OF WALLET
export const getDefaultAddress = (walletDefaultAddRequest) => ({
  type: GET_DEFAULT_ADD,
  walletDefaultAddRequest: walletDefaultAddRequest
})
export const getDefaultAddressSuccess = (response) => ({
  type: GET_DEFAULT_ADD_SUCCESS,
  payload: response
})
export const getDefaultAddressFailure = (error) => ({
  type: GET_DEFAULT_ADD_FAILURE,
  payload: error
})

//GET WITHDRAW FEE AND MIN MAX LIMIT
export const getFeeAndLimits = (feeLimitRequest) => ({
  type: GET_FEEANDLIMIT,
  feeLimitRequest: feeLimitRequest
})
export const getFeeAndLimitsSuccess = (response) => ({
  type: GET_FEEANDLIMIT_SUCCESS,
  payload: response
})
export const getFeeAndLimitsFailure = (error) => ({
  type: GET_FEEANDLIMIT_FAILURE,
  payload: error
})

// GET WALLET BALANCE REQUEST
export const getWalletBalance = (allBalanceRequest) => ({
  type: GET_AD_BALANCE,
  allBalanceRequest: allBalanceRequest
})
export const getBalanceSuccess = (response) => ({
  type: GET_AD_BALANCE_SUCCESS,
  payload: response
})
export const getBalanceFailure = (error) => ({
  type: GET_AD_BALANCE_FAILURE,
  payload: error
})