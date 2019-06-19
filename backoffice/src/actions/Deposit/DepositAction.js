/* 
    Developer : Nishant Vadgama
    Date : 18-03-2019
    File Comment : Deposit Report Actions
*/
import {
    // get deposit report
    GET_DEPOSIT_REPORT_DETAIL,
    GET_DEPOSIT_REPORT_DETAIL_SUCCESS,
    GET_DEPOSIT_REPORT_DETAIL_FAILURE,
    // process deposit recon
    DEPOSIT_RECON_PROCESS,
    DEPOSIT_RECON_PROCESS_SUCCESS,
    DEPOSIT_RECON_PROCESS_FAILURE,
    // 2FA AUTHENTICATION
    WITHDRAWA2FAAUTH,
    WITHDRAWA2FAAUTH_SUCCESS,
    WITHDRAWA2FAAUTH_FAILURE,
} from "../types";

/* get deposit report */
export const getDepositReport = (request) => ({
    type: GET_DEPOSIT_REPORT_DETAIL,
    request: request
});

export const getDepositReportSuccess = (response) => ({
    type: GET_DEPOSIT_REPORT_DETAIL_SUCCESS,
    payload: response
});

export const getDepositReportFailure = (error) => ({
    type: GET_DEPOSIT_REPORT_DETAIL_FAILURE,
    payload: error
});

/* Deposit Recon Process methods */
export const doReconProcess = (request) => ({
    type: DEPOSIT_RECON_PROCESS,
    request: request
});

export const doReconProcessSuccess = (response) => ({
    type: DEPOSIT_RECON_PROCESS_SUCCESS,
    payload: response
});

export const doReconProcessFailure = (error) => ({
    type: DEPOSIT_RECON_PROCESS_FAILURE,
    payload: error
});

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

