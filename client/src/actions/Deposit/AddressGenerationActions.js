/* 
    Developer : Nishant Vadgama
    Date : 14-09-2018
    File Comment : Address Generation deposit actions
*/
import {
    // get currency lsit
    GET_AD_CURRENCY,
    GET_AD_CURRENCY_SUCCESS,
    GET_AD_CURRENCY_FAILURE,
    // get wallets and balance,
    GET_AD_WALLETS,
    GET_AD_WALLETS_SUCCESS,
    GET_AD_WALLETS_FAILURE,
    //get wallet Balance
    GET_AD_BALANCE,
    GET_AD_BALANCE_SUCCESS,
    GET_AD_BALANCE_FAILURE,
    //get defualt wallet address
    GET_DEFAULT_ADD,
    GET_DEFAULT_ADD_SUCCESS,
    GET_DEFAULT_ADD_FAILURE,
    // generate address
    GENERATE_ADDRESS,
    GENERATE_ADDRESS_SUCCESS,
    GENERATE_ADDRESS_FAILURE,
    //update p2sh convertion
    UPDATE_P2SH_ADDRESS,
    UPDATE_P2SH_ADDRESS_SUCCESS,
    UPDATE_P2SH_ADDRESS_FAILURE,
} from '../types';

/* 
    Developer : Nishant Vadgama
    Date : 14-09-2018
    Comment :Function for dispatch Get balance Action
*/
export const getCurrency = () => ({
    type: GET_AD_CURRENCY
});

/* 
    Developer : Nishant Vadgama
    Date : 14-09-2018
    Comment :Function for dispatch Get balance Action for Success
*/
export const getCurrencySuccess = (response) => ({
    type: GET_AD_CURRENCY_SUCCESS,
    payload: response
})

/* 
    Developer : Nishant Vadgama
    Date : 14-09-2018
    Comment :Function for dispatch Get balance Action for Failure
*/
export const getCurrencyFailure = (error) => ({
    type: GET_AD_CURRENCY_FAILURE,
    payload: error
})

/* 
    Developer : Nishant Vadgama
    Date : 14-09-2018
    Comment :Function for dispatch Get Address Action
*/
export const getWallets = (request) => ({
    type: GET_AD_WALLETS,
    request: request
});

/* 
    Developer : Nishant Vadgama
    Date : 14-09-2018
    Comment :Function for dispatch Get Address Action for Success
*/
export const getWalletsSuccess = (response) => ({
    type: GET_AD_WALLETS_SUCCESS,
    payload: response
})

/* 
    Developer : Nishant Vadgama
    Date : 14-09-2018
    Comment :Function for dispatch Get Address Action for Failure
*/
export const getWalletsFailure = (error) => ({
    type: GET_AD_WALLETS_FAILURE,
    payload: error
})

// GET WALLET BALANCE REQUEST
export const getBalance = (walletId) => ({
    type: GET_AD_BALANCE,
    walletId: walletId
})
export const getBalanceSuccess = (response) => ({
    type: GET_AD_BALANCE_SUCCESS,
    payload: response
})
export const getBalanceFailure = (error) => ({
    type: GET_AD_BALANCE_FAILURE,
    payload: error
})

// GET DEFAULT ADDRESS OF WALLET
export const getDefaultAddress = (walletId) => ({
    type: GET_DEFAULT_ADD,
    walletId: walletId
})
export const getDefaultAddressSuccess = (response) => ({
    type: GET_DEFAULT_ADD_SUCCESS,
    payload: response
})
export const getDefaultAddressFailure = (error) => ({
    type: GET_DEFAULT_ADD_FAILURE,
    payload: error
})

/* 
    Developer : Nishant Vadgama
    Date : 17-09-2018
    Comment : Generate new address method action dispatch
*/
export const generateNewAddress = (request) => ({
    type: GENERATE_ADDRESS,
    request: request
});

/* 
    Developer : Nishant Vadgama
    Date : 17-09-2018
    Comment :Function for dispatch generate address action for Success
*/
export const generateNewAddressSuccess = (response) => ({
    type: GENERATE_ADDRESS_SUCCESS,
    payload: response
})

/* 
    Developer : Nishant Vadgama
    Date : 17-09-2018
    Comment :Function for dispatch generate new address failure action
*/
export const generateNewAddressFailure = (error) => ({
    type: GENERATE_ADDRESS_FAILURE,
    payload: error
})


// update ltc p2sh convertion address
export const updateP2shAddress = (request) => ({
    type: UPDATE_P2SH_ADDRESS,
    request: request
})
export const updateP2shAddressSuccess = (response) => ({
    type: UPDATE_P2SH_ADDRESS_SUCCESS,
    payload: response
})
export const updateP2shAddressFailure = (error) => ({
    type: UPDATE_P2SH_ADDRESS_FAILURE,
    payload: error
})