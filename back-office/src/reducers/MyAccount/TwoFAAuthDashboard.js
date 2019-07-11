/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount 2FA Authentication Dashboard
*/
import {
    TWO_FA_DASHBOARD,
    TWO_FA_DASHBOARD_SUCCESS,
    TWO_FA_DASHBOARD_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    twoFADashData: [],
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
    }
    switch (action.type) {
        case TWO_FA_DASHBOARD:
            return { ...state, loading: true, twoFADashData: '' };

        case TWO_FA_DASHBOARD_SUCCESS:
            return { ...state, loading: false, twoFADashData: action.payload };

        case TWO_FA_DASHBOARD_FAILURE:
            return { ...state, loading: false, twoFADashData: action.payload };

        default:
            return { ...state };
    }
};