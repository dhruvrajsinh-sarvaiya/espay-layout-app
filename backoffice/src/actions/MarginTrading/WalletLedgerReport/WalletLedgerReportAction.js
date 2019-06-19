/* 
    Developer : Parth Andhariya
    File Comment : Wallet Ledger Report action methods
    Date : 01-03-2019
*/
import {
    GET_USER_MARGIN_WALLETS,
    GET_USER_MARGIN_WALLETS_SUCCESS,
    GET_USER_MARGIN_WALLETS_FAILURE,
    MARGIN_WALLET_LEDGER,
    MARGIN_WALLET_LEDGER_SUCCESS,
    MARGIN_WALLET_LEDGER_FAILURE
} from "../../types";

/* get a list of User Margin Wallets */
export const getUserMarginWallets = (request) => ({
    type: GET_USER_MARGIN_WALLETS,
    request: request
});
export const getUserMarginWalletsSuccess = (response) => ({
    type: GET_USER_MARGIN_WALLETS_SUCCESS,
    payload: response
});
export const getUserMarginWalletsFailure = (error) => ({
    type: GET_USER_MARGIN_WALLETS_FAILURE,
    payload: error
});

/* get a list Margin Wallet Ledger */
export const getMarginWalletLedger = (request) => ({
    type: MARGIN_WALLET_LEDGER,
    request: request
})
export const getMarginWalletLedgerSuccess = (response) => ({
    type: MARGIN_WALLET_LEDGER_SUCCESS,
    payload: response
})
export const getMarginWalletLedgerFailure = (error) => ({
    type: MARGIN_WALLET_LEDGER_FAILURE,
    payload: error
})