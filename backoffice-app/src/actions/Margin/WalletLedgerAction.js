import {
    // Get User Margin Wallets
    GET_USER_MARGIN_WALLETS,
    GET_USER_MARGIN_WALLETS_SUCCESS,
    GET_USER_MARGIN_WALLETS_FAILURE,
    MARGIN_WALLET_LEDGER,
    MARGIN_WALLET_LEDGER_SUCCESS,
    MARGIN_WALLET_LEDGER_FAILURE,
    CLEAR_MARGIN_WALLET_LEDGER
} from "../ActionTypes";

// Redux for User Margin Wallets Action
export const getUserMarginWallets = (request) => ({
    type: GET_USER_MARGIN_WALLETS,
    request: request
});

// Redux for User Margin Wallets Action Success
export const getUserMarginWalletsSuccess = (response) => ({
    type: GET_USER_MARGIN_WALLETS_SUCCESS,
    payload: response
});

// Redux for User Margin Wallets Action Failure
export const getUserMarginWalletsFailure = (error) => ({
    type: GET_USER_MARGIN_WALLETS_FAILURE,
    payload: error
});

// Redux for Margin Wallet Ledger Action
export const getMarginWalletLedger = (request) => ({
    type: MARGIN_WALLET_LEDGER,
    request: request
})

// Redux for Margin Wallet Ledger Action Success
export const getMarginWalletLedgerSuccess = (response) => ({
    type: MARGIN_WALLET_LEDGER_SUCCESS,
    payload: response
})

// Redux for Margin Wallet Ledger Action Failure 
export const getMarginWalletLedgerFailure = (error) => ({
    type: MARGIN_WALLET_LEDGER_FAILURE,
    payload: error
})

// clear a list Margin Wallet Ledger
export const clearMarginWalletLedger = () => ({
    type: CLEAR_MARGIN_WALLET_LEDGER,
})
