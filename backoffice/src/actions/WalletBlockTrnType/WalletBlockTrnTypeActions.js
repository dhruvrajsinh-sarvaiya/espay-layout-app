/* 
    Developer : Nishant Vadgama
    FIle Comment : wallet block trn type methods 
    Date : 19-12-2018
*/

import {
    // get list
    GETWALLETBLOCKTRNLIST,
    GETWALLETBLOCKTRNLIST_SUCCESS,
    GETWALLETBLOCKTRNLIST_FAILURE,
    //update status
    CHANGEWALLETBLOCKTRNSTATUS,
    CHANGEWALLETBLOCKTRNSTATUS_SUCCESS,
    CHANGEWALLETBLOCKTRNSTATUS_FAILURE,
    //insert&update record
    UPDATEWALLETBLOCKTRN,
    UPDATEWALLETBLOCKTRN_SUCCESS,
    UPDATEWALLETBLOCKTRN_FAILURE
} from "../types";

// get users wallet block trn list
export const getWalletBlockTrnList = () => ({
    type: GETWALLETBLOCKTRNLIST
});
export const getWalletBlockTrnListSuccess = response => ({
    type: GETWALLETBLOCKTRNLIST_SUCCESS,
    payload: response.Data
});
export const getWalletBlockTrnListFailure = error => ({
    type: GETWALLETBLOCKTRNLIST_FAILURE,
    payload: error
});


//change status methods
export const changeWalletBlockTrnStatus = (request) => ({
    type: CHANGEWALLETBLOCKTRNSTATUS,
    payload: request
});
export const changeWalletBlockTrnStatusSuccess = response => ({
    type: CHANGEWALLETBLOCKTRNSTATUS_SUCCESS,
    payload: response
});
export const changeWalletBlockTrnStatusFailure = error => ({
    type: CHANGEWALLETBLOCKTRNSTATUS_FAILURE,
    payload: error
});

//insert & update wallet block trn type
export const insertUpdateWalletBlockTrn = (request) => ({
    type: UPDATEWALLETBLOCKTRN,
    payload: request
});
export const insertUpdateWalletBlockTrnSuccess = response => ({
    type: UPDATEWALLETBLOCKTRN_SUCCESS,
    payload: response
});
export const insertUpdateWalletBlockTrnFailure = error => ({
    type: UPDATEWALLETBLOCKTRN_FAILURE,
    payload: error
});