import {
    // Get Withdraw Report
    GET_WITHDRAW_REPORT,
    GET_WITHDRAW_REPORT_SUCCESS,
    GET_WITHDRAW_REPORT_FAILURE,

    // Withdraw Recon Process
    WITHDRAW_RECON_PROCESS,
    WITHDRAW_RECON_PROCESS_SUCCESS,
    WITHDRAW_RECON_PROCESS_FAILURE,

    // Clear Withdraw Report Data
    CLEAR_WITHDRAW_REPORT_DATA
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Withdraw Report List
export function getWithdrawReport(payload) {
    return action(GET_WITHDRAW_REPORT, { payload })
}

// Redux action for Get Withdraw Report List Success
export function getWithdrawReportSuccess(data) {
    return action(GET_WITHDRAW_REPORT_SUCCESS, { data })
}

// Redux action for Get Withdraw Report List Success
export function getWithdrawReportFailure() {
    return action(GET_WITHDRAW_REPORT_FAILURE)
}

// Redux action for Withdraw Recon Data
export function withdrawReconProcess(payload) {
    return action(WITHDRAW_RECON_PROCESS, { payload })
}

// Redux action for Withdraw Recon Data Success
export function withdrawReconProcessSuccess(data) {
    return action(WITHDRAW_RECON_PROCESS_SUCCESS, { data })
}

// Redux action for Withdraw Recon Data Success
export function withdrawReconProcessFailure() {
    return action(WITHDRAW_RECON_PROCESS_FAILURE)
}

// Redux action for Clear Withdraw Report Data
export function clearWithdrawReportData() {
    return action(CLEAR_WITHDRAW_REPORT_DATA)
}