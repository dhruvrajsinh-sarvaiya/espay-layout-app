/*
* Organization ledger Action File
* Added By Jinesh Bhatt
* Date : 07-01-2019*/

import {
    GET_ORGANIZATION_LEDGER_LIST,
    GET_ORGANIZATION_LEDGER_LIST_SUCCESS,
    GET_ORGANIZATION_LEDGER_LIST_FAIL
} from 'Actions/types';


// redux action for get Organization Ledger Report
export const displayOrganizationLedger = tradingledgerRequest => ({
    type: GET_ORGANIZATION_LEDGER_LIST,
    payload: tradingledgerRequest
});

// redux action for get Organization Ledger Report successfull
export const displayOrganizationLedgerSuccess = response => ({
    type: GET_ORGANIZATION_LEDGER_LIST_SUCCESS,
    payload: response
});

// redux action for get Organization Ledger Report with some error
export const displayOrganizationLedgerFail = error => ({
    type: GET_ORGANIZATION_LEDGER_LIST_FAIL,
    payload: error
});