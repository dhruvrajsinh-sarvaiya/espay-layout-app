/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Report Dashboard
*/
import {
    REPORT_DASHBOARD,
    REPORT_DASHBOARD_SUCCESS,
    REPORT_DASHBOARD_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    reportDashData: [],
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case REPORT_DASHBOARD:
            return { ...state, loading: true, reportDashData: '' };

        case REPORT_DASHBOARD_SUCCESS:
            return { ...state, loading: false, reportDashData: action.payload };

        case REPORT_DASHBOARD_FAILURE:
            return { ...state, loading: false, reportDashData: action.payload };

        default:
            return { ...state };
    }
};