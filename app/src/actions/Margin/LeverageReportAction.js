import {
    // Leverage Request Report List
    LEVERAGE_REQUEST_REPORT_LIST,
    LEVERAGE_REQUEST_REPORT_LIST_SUCCESS,
    LEVERAGE_REQUEST_REPORT_LIST_FAILURE,
} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux action to Get Leverage Report List
export function getLeverageReportList(Request) {
    return action(LEVERAGE_REQUEST_REPORT_LIST, { Request })
}
// Redux action to Get Leverage Report List Success
export function getLeverageReportListSuccess(response) {
    return action(LEVERAGE_REQUEST_REPORT_LIST_SUCCESS, { response })
}
// Redux action to Get Leverage Report List Failure
export function getLeverageReportListFailure(error) {
    return action(LEVERAGE_REQUEST_REPORT_LIST_FAILURE, { error })
}