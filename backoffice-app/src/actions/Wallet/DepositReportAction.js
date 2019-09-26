import {
    // Get Deposit Report
    GET_DEPOSIT_REPORT,
    GET_DEPOSIT_REPORT_SUCCESS,
    GET_DEPOSIT_REPORT_FAILURE,

    // Clear Deposit Report Data
    CLEAR_DEPOSIT_REPORT_DATA,

    // Deposit Recon Process
    DEPOSIT_RECON_PROCESS,
    DEPOSIT_RECON_PROCESS_SUCCESS,
    DEPOSIT_RECON_PROCESS_FAILURE
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Deposit Report
export function getDepositReport(payload) {
    return action(GET_DEPOSIT_REPORT, { payload })
}

// Redux action for Get Deposit Report Success
export function getDepositReportSuccess(data) {
    return action(GET_DEPOSIT_REPORT_SUCCESS, { data })
}

// Redux action for Get Deposit Report Failure
export function getDepositReportFailure() {
    return action(GET_DEPOSIT_REPORT_FAILURE)
}

// Redux action for Deposit Recon Process
export function depositReconProcess(payload) {
    return action(DEPOSIT_RECON_PROCESS, { payload })
}

// Redux action for Deposit Recon Process Success
export function depositReconProcessSuccess(data) {
    return action(DEPOSIT_RECON_PROCESS_SUCCESS, { data })
}

// Redux action for Deposit Recon Process Failure
export function depositReconProcessFailure() {
    return action(DEPOSIT_RECON_PROCESS_FAILURE)
}

// Redux action for Get Deposit Report
export function clearDepositReportData() {
    return action(CLEAR_DEPOSIT_REPORT_DATA)
}