/* 
    Developer : Kevin Ladani
    Date : 03-12-2018
    File Comment : MyAccount Login History Dashboard
*/
import {
    LIST_LOGINHISTORY_DASHBOARD,
    LIST_LOGINHISTORY_DASHBOARD_SUCCESS,
    LIST_LOGINHISTORY_DASHBOARD_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    LoginHistoryDashData: [],
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE 
    }
    switch (action.type) {
        case LIST_LOGINHISTORY_DASHBOARD:
            return { ...state, loading: true, LoginHistoryDashData: '' };

        case LIST_LOGINHISTORY_DASHBOARD_SUCCESS:
        case LIST_LOGINHISTORY_DASHBOARD_FAILURE:
            return { ...state, loading: false, LoginHistoryDashData: action.payload };

        default:
            return { ...state };
    }
};