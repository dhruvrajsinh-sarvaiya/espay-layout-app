/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Group Dashboard
*/
import {
    GROUP_DASHBOARD,
    GROUP_DASHBOARD_SUCCESS,
    GROUP_DASHBOARD_FAILURE
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
        case GROUP_DASHBOARD:
            return { ...state, loading: true, grpDashData: '' };

        case GROUP_DASHBOARD_SUCCESS:
        case GROUP_DASHBOARD_FAILURE:
            return { ...state, loading: false, grpDashData: action.payload };

        default:
            return { ...state };
    }
};