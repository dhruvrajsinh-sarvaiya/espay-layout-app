// IpWiseRequestReportReducer.js
import {
    // for Ip Wise Request Report
    GET_IP_WISE_REPORT,
    GET_IP_WISE_REPORT_SUCCESS,
    GET_IP_WISE_REPORT_FAILURE,

    // for clear Ip Wise Request Report
    CLEAR_IP_WISE_REPORT,

    // Action Logout
    ACTION_LOGOUT,

} from "../../actions/ActionTypes";

// Initial State for Ip Wise Request Report
const INITIAL_STATE = {

    // for Ip Wise Request Report
    IpWiseReportList: null,
    IpWiseReportListLoading: false,
    IpWiseReportListError: false,
}

export default function IpWiseRequestReportReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Ip Wise Request Report method data
        case GET_IP_WISE_REPORT:
            return Object.assign({}, state, {
                IpWiseReportList: null,
                IpWiseReportListLoading: true
            })
        // Set Ip Wise Request Report success data
        case GET_IP_WISE_REPORT_SUCCESS:
            return Object.assign({}, state, {
                IpWiseReportList: action.data,
                IpWiseReportListLoading: false,
            })
        // Set Ip Wise Request Report failure data
        case GET_IP_WISE_REPORT_FAILURE:
            return Object.assign({}, state, {
                IpWiseReportList: null,
                IpWiseReportListLoading: false,
                IpWiseReportListError: true
            })
        // for Clear Ip Wise Request Report Data
        case CLEAR_IP_WISE_REPORT:
            return INITIAL_STATE
        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}