/* 
    Developer : Kevin Ladani
    Date : 03-12-2018
    File Comment : MyAccount IPHistory Dashboard
*/
import {
    LIST_IPHISTORY_DASHBOARD,
    LIST_IPHISTORY_DASHBOARD_SUCCESS,
    LIST_IPHISTORY_DASHBOARD_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    IPHistoryDashData: {},
    loading: false
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        case LIST_IPHISTORY_DASHBOARD:
            return { ...state, loading: true, IPHistoryDashData: {} };

        case LIST_IPHISTORY_DASHBOARD_SUCCESS:
        case LIST_IPHISTORY_DASHBOARD_FAILURE:
            return { ...state, loading: false, IPHistoryDashData: action.payload };

        default:
            return { ...state };
    }
};