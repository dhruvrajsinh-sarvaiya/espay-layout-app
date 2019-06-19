/* 
    Developer : Nishant Vadgama
    Date : 06-02-2019
    File Comment : Organization ledger actions
*/

import {
    //wallets...
    GET_ORG_WALLETS,
    GET_ORG_WALLETS_SUCCESS,
    GET_ORG_WALLETS_FAILURE,
    //ledger...
    GET_ORG_LEDGER,
    GET_ORG_LEDGER_SUCCESS,
    GET_ORG_LEDGER_FAILURE,
} from '../types';


/* get organization wallets */
export const getOrganizationWallets = (request) => ({
    type: GET_ORG_WALLETS,
    request: request
});
export const getOrganizationWalletsSuccess = (response) => ({
    type: GET_ORG_WALLETS_SUCCESS,
    payload: response.Data
});
export const getOrganizationWalletsFailure = (error) => ({
    type: GET_ORG_WALLETS_FAILURE,
    payload: error
});

/* get organization wallet ledger */
export const getOrganizationLedger = (request) => ({
    type: GET_ORG_LEDGER,
    request: request
});
export const getOrganizationLedgerSuccess = (response) => ({
    type: GET_ORG_LEDGER_SUCCESS,
    payload: response
});
export const getOrganizationLedgerFailure = (error) => ({
    type: GET_ORG_LEDGER_FAILURE,
    payload: error
});