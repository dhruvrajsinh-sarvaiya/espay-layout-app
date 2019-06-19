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

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case SOCIAL_LOGIN_DASHBOARD:
            return { ...state, loading: true, slngDashData: '' };

        case SOCIAL_LOGIN_DASHBOARD_SUCCESS:
            return { ...state, loading: false, slngDashData: action.payload };

        case SOCIAL_LOGIN_DASHBOARD_FAILURE:
            return { ...state, loading: false, slngDashData: action.payload };

        default:
            return { ...state };
    }
};