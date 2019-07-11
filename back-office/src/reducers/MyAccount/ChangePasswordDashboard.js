/* 
    Developer : Kevin Ladani
    Date : 04-12-2018
    File Comment : MyAccount ChangePassword Dashboard
*/
import {
    CHANGE_PASSWORD_DASHBOARD,
    CHANGE_PASSWORD_DASHBOARD_SUCCESS,
    CHANGE_PASSWORD_DASHBOARD_FAILURE,
} from "Actions/types";

/**
 * initial data
 */
const INITIAL_STATE = {
    loading: false,
    data: {}
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        //Change Password Dashboard Configuration..
        case CHANGE_PASSWORD_DASHBOARD:
            return { ...state, loading: true, data: {} };

        case CHANGE_PASSWORD_DASHBOARD_SUCCESS:
        case CHANGE_PASSWORD_DASHBOARD_FAILURE:
            return { ...state, loading: false, data: action.payload };

        default:
            return { ...state };
    }
};