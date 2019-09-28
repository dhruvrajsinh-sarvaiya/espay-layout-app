import {
    // Get Open Position Report
    GET_OPEN_POSITION_REPORT,
    GET_OPEN_POSITION_REPORT_SUCCESS,
    GET_OPEN_POSITION_REPORT_FAILURE,

    // Clear Open Position Report
    CLEAR_OPEN_POSITION_REPORT
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Open Position Report List
export function getOpenPositionReport(payload = {}) {
    return action(GET_OPEN_POSITION_REPORT, { payload })
}

// Redux action for Get Open Position Report List Success
export function getOpenPositionReportSuccess(data) {
    return action(GET_OPEN_POSITION_REPORT_SUCCESS, { data })
}

// Redux action for Get Open Position Report List Failure
export function getOpenPositionReportFailure() {
    return action(GET_OPEN_POSITION_REPORT_FAILURE)
}

// Redux action for Clear Open Position Data
export function clearOpenPositionData() {
    return action(CLEAR_OPEN_POSITION_REPORT)
}