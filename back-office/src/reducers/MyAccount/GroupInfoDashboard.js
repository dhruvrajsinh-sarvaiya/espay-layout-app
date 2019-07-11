/* 
    Developer : Kevin Ladani
    Date : 21-12-2018
    File Comment : MyAccount Group Dashboard Reducer
*/
import {
    GROUP_INFO_DASHBOARD,
    GROUP_INFO_DASHBOARD_SUCCESS,
    GROUP_INFO_DASHBOARD_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    grpDashData: [],
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
    }

    switch (action.type) {
        case GROUP_INFO_DASHBOARD:
            return { ...state, loading: true, grpDashData: '' };

        case GROUP_INFO_DASHBOARD_SUCCESS:
        case GROUP_INFO_DASHBOARD_FAILURE:
            return { ...state, loading: false, grpDashData: action.payload };

        default:
            return { ...state };
    }
};