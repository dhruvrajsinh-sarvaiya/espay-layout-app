/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Admin Dashboard
*/
import {
    ADMIN_DASHBOARD,
    ADMIN_DASHBOARD_SUCCESS,
    ADMIN_DASHBOARD_FAILURE,

    // For Add Admin
    ADD_ADMIN_DASHBOARD,
    ADD_ADMIN_DASHBOARD_SUCCESS,
    ADD_ADMIN_DASHBOARD_FAILURE,

} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    adminDashData: [],
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case ADMIN_DASHBOARD:
            return { ...state, loading: true, adminDashData: '' };

        case ADMIN_DASHBOARD_SUCCESS:
            return { ...state, loading: false, adminDashData: action.payload };

        case ADMIN_DASHBOARD_FAILURE:
            return { ...state, loading: false, adminDashData: action.payload };

        //Add Admin Dashboard Configuration..
        case ADD_ADMIN_DASHBOARD:
            return { ...state, loading: true };

        case ADD_ADMIN_DASHBOARD_SUCCESS:
            return { ...state, loading: true, data: action.payload };

        case ADD_ADMIN_DASHBOARD_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return { ...state };
    }
};