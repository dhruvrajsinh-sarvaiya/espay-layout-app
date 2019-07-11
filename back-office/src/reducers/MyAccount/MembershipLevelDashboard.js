/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Membership Level Dashboard
*/
import {
    MEMBERSHIP_LEVEL_DASHBOARD,
    MEMBERSHIP_LEVEL_DASHBOARD_SUCCESS,
    MEMBERSHIP_LEVEL_DASHBOARD_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    mshipDashData: [],
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        case MEMBERSHIP_LEVEL_DASHBOARD:
            return { ...state, loading: true, mshipDashData: '' };

        case MEMBERSHIP_LEVEL_DASHBOARD_SUCCESS:
        case MEMBERSHIP_LEVEL_DASHBOARD_FAILURE:
            return { ...state, loading: false, mshipDashData: action.payload };

        default:
            return { ...state };
    }
};