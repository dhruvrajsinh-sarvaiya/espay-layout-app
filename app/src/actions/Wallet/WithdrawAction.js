import {
    // Fetch Withdraw Request
    FetchWithdrawRequest,
    FetchGenerateAddress,

    // Dropdown Change
    DropdownChange,

    // Fetch Withdraw History Data
    FETCHING_WITHFRAW_HISTORY_DATA,

    // get wallets and balance,
    GET_AD_WALLETS,
    GET_AD_WALLETS_SUCCESS,
    GET_AD_WALLETS_FAILURE,

    //get wallet Balance
    GET_AD_BALANCE,
    GET_AD_BALANCE_SUCCESS,
    GET_AD_BALANCE_FAILURE,

    //get fee & min max withdraw limit
    GET_FEEANDLIMIT,
    GET_FEEANDLIMIT_SUCCESS,
    GET_FEEANDLIMIT_FAILURE,

    // Verify 2FA Withdraw
    VERIFY_2FA_WITHDRAW,
    VERIFY_2FA_WITHDRAW_FAILURE,
    VERIFY_2FA_WITHDRAW_SUCCESS,

    //For Resend Withdrawal Confirmation Mail
    RESEND_WITHDRAWAL_EMAIL,
    RESEND_WITHDRAWAL_EMAIL_SUCCESS,
    RESEND_WITHDRAWAL_EMAIL_FAILURE,

} from '../ActionTypes';
import { action } from '../GlobalActions';

// Redux action For Withdraw Request
export function OnWithdrawRequest(withdrawRequest) {
    return action(FetchWithdrawRequest, { withdrawRequest })
}

// Redux action For Generate Address
export function OnGenerateAddress(AccWalletID) {
    return action(FetchGenerateAddress, { AccWalletID })
}

//on Dropdown coin or address selection
export function OnDropdownChange() {
    return action(DropdownChange)
}

// Redux action For Withdraw History
export function OnWithdrawHistory(withdrawHistoryRequest) {
    return action(FETCHING_WITHFRAW_HISTORY_DATA, { withdrawHistoryRequest })
}

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

// Redux action for GET WALLET BALANCE REQUEST
export const getWalletBalance = (allBalanceRequest) => ({
    type: GET_AD_BALANCE,
    allBalanceRequest: allBalanceRequest
})

// Redux action for GET WALLET BALANCE REQUEST success
export const getBalanceSuccess = (response) => ({
    type: GET_AD_BALANCE_SUCCESS,
    payload: response
})

// Redux action for GET WALLET BALANCE REQUEST failure
export const getBalanceFailure = (error) => ({
    type: GET_AD_BALANCE_FAILURE,
    payload: error
})

// Redux action for GET WITHDRAW FEE AND MIN MAX LIMIT
export const getFeeAndLimits = (feeLimitRequest) => ({
    type: GET_FEEANDLIMIT,
    feeLimitRequest: feeLimitRequest
})

// Redux action for GET WITHDRAW FEE AND MIN MAX LIMIT success
export const getFeeAndLimitsSuccess = (response) => ({
    type: GET_FEEANDLIMIT_SUCCESS,
    payload: response
})

// Redux action for GET WITHDRAW FEE AND MIN MAX LIMIT failure
export const getFeeAndLimitsFailure = (error) => ({
    type: GET_FEEANDLIMIT_FAILURE,
    payload: error
})

/**
 * Redux Action 2FA Google Authentication Success
 */
export const twoFAGoogleAuthenticationSuccess = data => ({
    type: VERIFY_2FA_WITHDRAW_SUCCESS,
    payload: data
});

/**
 * Redux Action 2FA Google Authentication Failure
 */
export const twoFAGoogleAuthenticationFailure = error => ({
    type: VERIFY_2FA_WITHDRAW_FAILURE,
    payload: error
});

/**
 * Redux Action To 2FA Google Authentication
 */
export const twoFAGoogleAuthentication = (verifyCodeRequest) => ({
    type: VERIFY_2FA_WITHDRAW,
    verifyCodeRequest: verifyCodeRequest,
});

// Redux action to Resend Withdrawal Email
export const ResendWithdrawalEmailSuccess = response => ({
    type: RESEND_WITHDRAWAL_EMAIL_SUCCESS,
    payload: response
});

// Redux action to Resend Withdrawal Email Success
export const ResendWithdrawalEmailFailure = error => ({
    type: RESEND_WITHDRAWAL_EMAIL_FAILURE,
    payload: error
});

// Redux action to Resend Withdrawal Email Failure
export const ResendWithdrawalEmail = (Request) => ({
    type: RESEND_WITHDRAWAL_EMAIL,
    Request: Request,
});