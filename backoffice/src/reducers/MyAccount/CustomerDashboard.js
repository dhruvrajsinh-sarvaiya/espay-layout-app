/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Customer Dashboard
*/
import {
    CUSTOMER_DASHBOARD,
    CUSTOMER_DASHBOARD_SUCCESS,
    CUSTOMER_DASHBOARD_FAILURE,

    LIST_CUSTOMER_DASHBOARD_REPORT,
    LIST_CUSTOMER_DASHBOARD_REPORT_SUCCESS,
    LIST_CUSTOMER_DASHBOARD_REPORT_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    countRptData: [],
    custDashData: [],
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case CUSTOMER_DASHBOARD:
            return { ...state, loading: true, countRptData: '' };

        case CUSTOMER_DASHBOARD_SUCCESS:
            return { ...state, loading: false, countRptData: action.payload };

        case CUSTOMER_DASHBOARD_FAILURE:
            return { ...state, loading: false, countRptData: action.payload };

        //For Customer Report
        case LIST_CUSTOMER_DASHBOARD_REPORT:
            return { ...state, loading: true, custDashData:'' };

        case LIST_CUSTOMER_DASHBOARD_REPORT_SUCCESS:
            return { ...state, loading: false, custDashData: action.payload };

        case LIST_CUSTOMER_DASHBOARD_REPORT_FAILURE:
            return { ...state, loading: false, custDashData: action.payload };

        default:
            return { ...state };
    }
};