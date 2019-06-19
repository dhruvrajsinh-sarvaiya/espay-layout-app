/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Language Dashboard
*/
import {
    LANGUAGE_DASHBOARD,
    LANGUAGE_DASHBOARD_SUCCESS,
    LANGUAGE_DASHBOARD_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    lngDashData: [],
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LANGUAGE_DASHBOARD:
            return { ...state, loading: true, lngDashData: '' };

        case LANGUAGE_DASHBOARD_SUCCESS:
            return { ...state, loading: false, lngDashData: action.payload };

        case LANGUAGE_DASHBOARD_FAILURE:
            return { ...state, loading: false, lngDashData: action.payload };

        default:
            return { ...state };
    }
};