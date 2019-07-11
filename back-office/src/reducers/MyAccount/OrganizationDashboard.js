/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Organization Dashboard
*/
import {
    ORGANIZATION_DASHBOARD,
    ORGANIZATION_DASHBOARD_SUCCESS,
    ORGANIZATION_DASHBOARD_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    orgDashData: [],
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        case ORGANIZATION_DASHBOARD:
            return { ...state, loading: true, orgDashData: '' };

        case ORGANIZATION_DASHBOARD_SUCCESS:
        case ORGANIZATION_DASHBOARD_FAILURE:
            return { ...state, loading: false, orgDashData: action.payload };

        default:
            return { ...state };
    }
};