/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount User Dashboard
*/
import {
    USER_DASHBOARD,
    USER_DASHBOARD_SUCCESS,
    USER_DASHBOARD_FAILURE,

    // For Add User
    ADD_USER_DASHBOARD,
    ADD_USER_DASHBOARD_SUCCESS,
    ADD_USER_DASHBOARD_FAILURE,

} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    usrDashData: [],
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case USER_DASHBOARD:
            return { ...state, loading: true, usrDashData: '' };

        case USER_DASHBOARD_SUCCESS:
            return { ...state, loading: false, usrDashData: action.payload };

        case USER_DASHBOARD_FAILURE:
            return { ...state, loading: false, usrDashData: action.payload };

        //Add User Dashboard Configuration..
        case ADD_USER_DASHBOARD:
            return { ...state, loading: true };

        case ADD_USER_DASHBOARD_SUCCESS:
            return { ...state, loading: true, data: action.payload };

        case ADD_USER_DASHBOARD_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return { ...state };
    }
};