/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Role Dashboard
*/
import {
    ROLE_DASHBOARD,
    ROLE_DASHBOARD_SUCCESS,
    ROLE_DASHBOARD_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    roleDashData: [],
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case ROLE_DASHBOARD:
            return { ...state, loading: true, roleDashData: '' };

        case ROLE_DASHBOARD_SUCCESS:
            return { ...state, loading: false, roleDashData: action.payload };

        case ROLE_DASHBOARD_FAILURE:
            return { ...state, loading: false, roleDashData: action.payload };

        default:
            return { ...state };
    }
};