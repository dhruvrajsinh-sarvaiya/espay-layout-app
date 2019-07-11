/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Social Login Dashboard
*/
import {
    SOCIAL_LOGIN_DASHBOARD,
    SOCIAL_LOGIN_DASHBOARD_SUCCESS,
    SOCIAL_LOGIN_DASHBOARD_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    slngDashData: [],
    loading: false
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        case SOCIAL_LOGIN_DASHBOARD:
            return { ...state, loading: true, slngDashData: '' };

        case SOCIAL_LOGIN_DASHBOARD_SUCCESS:
        case SOCIAL_LOGIN_DASHBOARD_FAILURE:
            return { ...state, loading: false, slngDashData: action.payload };

        default:
            return { ...state };
    }
};