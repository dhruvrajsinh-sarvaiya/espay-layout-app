/* 
    Developer : Nishant Vadgama
    Date : 18-09-2018
    File Comment : Withdraw page actions
*/
import {
    // get currency lsit
    GET_WD_CURRENCY,
    GET_WD_CURRENCY_SUCCESS,
    GET_WD_CURRENCY_FAILURE,
    // get wallets and balance,
    GET_WD_WALLETS,
    GET_WD_WALLETS_SUCCESS,
    GET_WD_WALLETS_FAILURE,
    //get wallet Balance
    GET_WD_BALANCE,
    GET_WD_BALANCE_SUCCESS,
    GET_WD_BALANCE_FAILURE,
    //get fee & min max withdraw limit
    GET_FEEANDLIMIT,
    GET_FEEANDLIMIT_SUCCESS,
    GET_FEEANDLIMIT_FAILURE,
    // withdraw proccess
    DO_WITHDRAW,
    DO_WITHDRAW_SUCCESS,
    DO_WITHDRAW_FAILURE,
    // address by wallet id
    ADDRESSBYWALLETID,
    ADDRESSBYWALLETID_SUCCESS,
    ADDRESSBYWALLETID_FAILURE,
    // 2FA AUTHENTICATION
    WITHDRAWA2FAAUTH,
    WITHDRAWA2FAAUTH_SUCCESS,
    WITHDRAWA2FAAUTH_FAILURE,
    //withdraw confirmation...
    WITHDRAWCONFRIMATION,
    WITHDRAWCONFRIMATION_SUCCESS,
    WITHDRAWCONFRIMATION_FAILURE,
    //withdrawal policy
    WITHDRAW_POLICY,
    WITHDRAW_POLICY_SUCCESS,
    WITHDRAW_POLICY_FAILURE,
} from '../types';

/* GET CURRENCY */
export const getCurrency = () => ({
    type: GET_WD_CURRENCY
});
export const getCurrencySuccess = (response) => ({
    type: GET_WD_CURRENCY_SUCCESS,
    payload: response
})
export const getCurrencyFailure = (error) => ({
    type: GET_WD_CURRENCY_FAILURE,
    payload: error
})

/* GET WALLET DETAILS */
export const getWallets = (request) => ({
    type: GET_WD_WALLETS,
    request: request
});
export const getWalletsSuccess = (response) => ({
    type: GET_WD_WALLETS_SUCCESS,
    payload: response
})
export const getWalletsFailure = (error) => ({
    type: GET_WD_WALLETS_FAILURE,
    payload: error
})

// GET WALLET BALANCE REQUEST
export const getBalance = (walletId) => ({
    type: GET_WD_BALANCE,
    walletId: walletId
})
export const getBalanceSuccess = (response) => ({
    type: GET_WD_BALANCE_SUCCESS,
    payload: response
})
export const getBalanceFailure = (error) => ({
    type: GET_WD_BALANCE_FAILURE,
    payload: error
})

//GET WITHDRAW FEE AND MIN MAX LIMIT
export const getFeeAndLimits = (request) => ({
    type: GET_FEEANDLIMIT,
    request: request
})
export const getFeeAndLimitsSuccess = (response) => ({
    type: GET_FEEANDLIMIT_SUCCESS,
    payload: response
})
export const getFeeAndLimitsFailure = (error) => ({
    type: GET_FEEANDLIMIT_FAILURE,
    payload: error
})


// DO WITHDRAW REQUEST
export const doWithdraw = (request) => ({
    type: DO_WITHDRAW,
    request: request
})
export const doWithdrawSuccess = (response) => ({
    type: DO_WITHDRAW_SUCCESS,
    payload: response
})
export const doWithdrawFailure = (error) => ({
    type: DO_WITHDRAW_FAILURE,
    payload: error
})

// GET ADDRESSES BY WALLET ID
export const getAddressById = (walletId) => ({
    type: ADDRESSBYWALLETID,
    walletId: walletId
})
export const getAddressByIdSuccess = (response) => ({
    type: ADDRESSBYWALLETID_SUCCESS,
    payload: response
})
export const getAddressByIdFailure = (error) => ({
    type: ADDRESSBYWALLETID_FAILURE,
    payload: error
})

// VERIFY 2FA FOR WITHDRAW PROCESS
export const verify2fa = (request) => ({
    type: WITHDRAWA2FAAUTH,
    request: request
})
export const verify2faSuccess = (response) => ({
    type: WITHDRAWA2FAAUTH_SUCCESS,
    payload: response
})
export const verify2faFailure = (error) => ({
    type: WITHDRAWA2FAAUTH_FAILURE,
    payload: error
})

// withdraw confirmation ...
export const confirmaWithdraw = (request) => ({
    type: WITHDRAWCONFRIMATION,
    request: request
})
export const confirmaWithdrawSuccess = (response) => ({
    type: WITHDRAWCONFRIMATION_SUCCESS,
    payload: response
})
export const confirmaWithdrawFailure = (error) => ({
    type: WITHDRAWCONFRIMATION_FAILURE,
    payload: error
})

// get withdrawal policy
export const getWithdrawalPolicy = (TrnType) => ({
    type: WITHDRAW_POLICY,
    TrnType: TrnType
})
export const getWithdrawalPolicySuccess = (response) => ({
    type: WITHDRAW_POLICY_SUCCESS,
    payload: response
})
export const getWithdrawalPolicyFailure = (error) => ({
    type: WITHDRAW_POLICY_FAILURE,
    payload: error
})