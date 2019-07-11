import {
    GET_WITHDRAWAL_REPORT_DETAIL,
    GET_WITHDRAWAL_REPORT_DETAIL_SUCCESS,
    GET_WITHDRAWAL_REPORT_DETAIL_FAILURE,
    DEPOSIT_WITHDRAWAL_RECON_PROCESS,
    DEPOSIT_WITHDRAWAL_RECON_PROCESS_SUCCESS,
    DEPOSIT_WITHDRAWAL_RECON_PROCESS_FAILURE,
} from "../types";

export const getWithdrawalReport = (request) => ({
    type: GET_WITHDRAWAL_REPORT_DETAIL,
    request: request
});

export const getWithdrawalReportSuccess = (response) => ({
    type: GET_WITHDRAWAL_REPORT_DETAIL_SUCCESS,
    payload: response
});

export const getWithdrawalReportFailure = (error) => ({
    type: GET_WITHDRAWAL_REPORT_DETAIL_FAILURE,
    payload: error
});

//added by parth andhariya
//WithdeawalRecon
export const doWithdeawalReconProcess = (data) => ({
    type: DEPOSIT_WITHDRAWAL_RECON_PROCESS,
    payload: data
});
export const doWithdeawalReconProcessSuccess = (response) => ({
    type: DEPOSIT_WITHDRAWAL_RECON_PROCESS_SUCCESS,
    payload: response
});

export const doWithdeawalReconProcessFailure = (error) => ({
    type: DEPOSIT_WITHDRAWAL_RECON_PROCESS_FAILURE,
    payload: error
});
