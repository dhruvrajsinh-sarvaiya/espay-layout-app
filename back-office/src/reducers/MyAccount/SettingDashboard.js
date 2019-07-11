/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Setting Dashboard
*/
import {
    SETTING_DASHBOARD,
    SETTING_DASHBOARD_SUCCESS,
    SETTING_DASHBOARD_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    settingDashData: [],
    loading: false
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        case SETTING_DASHBOARD:
            return { ...state, loading: true, settingDashData: '' };

        case SETTING_DASHBOARD_SUCCESS:
        case SETTING_DASHBOARD_FAILURE:
            return { ...state, loading: false, settingDashData: action.payload };

        default:
            return { ...state };
    }
};