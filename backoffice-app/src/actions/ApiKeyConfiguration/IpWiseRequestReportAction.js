// IpWiseRequestReportAction.js
import {
    // for Ip Wise Request Report
    GET_IP_WISE_REPORT,
    GET_IP_WISE_REPORT_SUCCESS,
    GET_IP_WISE_REPORT_FAILURE,

    // for clear Ip Wise Request Report
    CLEAR_IP_WISE_REPORT
} from '../ActionTypes';
import { action } from '../GlobalActions';

// Redux action for Get Ip Wise Request Report
export function getIpWiseReport(payload = {}) {
    return action(GET_IP_WISE_REPORT, { payload })
}

// Redux action for Get Ip Wise Request Report Success
export function getIpWiseReportSuccess(data) {
    return action(GET_IP_WISE_REPORT_SUCCESS, { data })
}

// Redux action for Get Ip Wise Request Report Failure
export function getIpWiseReportFailure() {
    return action(GET_IP_WISE_REPORT_FAILURE)
}

// Redux action for clear Ip Wise Request Report
export function clearIpWiseReport() {
    return action(CLEAR_IP_WISE_REPORT)
}