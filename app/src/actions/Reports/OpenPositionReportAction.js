import {
    // Get Open Position Report Data
    GET_OPEN_POSITION_REPORT_DATA,
    GET_OPEN_POSITION_REPORT_DATA_SUCCESS,
    GET_OPEN_POSITION_REPORT_DATA_FAILURE,
} from '../ActionTypes'

import { action } from '../GlobalActions';

// Redux action to Get Open Position Report
export function getOpenPositionReportData(payload) {
    return action(GET_OPEN_POSITION_REPORT_DATA, { payload })
}
// Redux action to Get Open Position Report Success
export function getOpenPositionReportDataSuccess(data) {
    return action(GET_OPEN_POSITION_REPORT_DATA_SUCCESS, { data })
}
// Redux action to Get Open Position Report Failure
export function getOpenPositionReportDataFailure() {
    return action(GET_OPEN_POSITION_REPORT_DATA_FAILURE)
}
