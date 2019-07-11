/* 
    Developer : Parth Andhariya
    Date : 17-06-2019
    File Comment : Provider ledger actions
*/

import {
    //Wallets...
    GET_PROVIDER_WALLETS,
    GET_PROVIDER_WALLETS_SUCCESS,
    GET_PROVIDER_WALLETS_FAILURE,
    //ledger...
    GET_PROVIDER_LEDGER,
    GET_PROVIDER_LEDGER_SUCCESS,
    GET_PROVIDER_LEDGER_FAILURE,
} from 'Actions/types';

/* get Provider wallets */
export const getProviderWallets = (request) => ({
    type: GET_PROVIDER_WALLETS,
    request: request
});
export const getProviderWalletsSuccess = (response) => ({
    type: GET_PROVIDER_WALLETS_SUCCESS,
    payload: response.Data
});
export const getProviderWalletsFailure = (error) => ({
    type: GET_PROVIDER_WALLETS_FAILURE,
    payload: error
});
/* get Provider wallet ledger */
export const getProviderLedger = (request) => ({
    type: GET_PROVIDER_LEDGER,
    request: request
});
export const getProviderLedgerSuccess = (response) => ({
    type: GET_PROVIDER_LEDGER_SUCCESS,
    payload: response
});
export const getProviderLedgerFailure = (error) => ({
    type: GET_PROVIDER_LEDGER_FAILURE,
    payload: error
});