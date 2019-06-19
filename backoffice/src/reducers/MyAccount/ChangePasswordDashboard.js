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
const INIT_STATE = {
    loading: false,
    data: {}
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        //Change Password Dashboard Configuration..
        case CHANGE_PASSWORD_DASHBOARD:   
            return { ...state, loading: true ,data: {}};

        case CHANGE_PASSWORD_DASHBOARD_SUCCESS:
            return { ...state, loading: true, data: action.payload };

        case CHANGE_PASSWORD_DASHBOARD_FAILURE:
            return { ...state, loading: false, data: action.payload };

        default:
            return { ...state };
    }
};