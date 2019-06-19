/* 
    Developer : Kevin Ladani
    Date : 21-12-2018
    File Comment : MyAccount Group Dashboard Reducer
*/
import {
    GROUP_INFO_DASHBOARD,
    GROUP_INFO_DASHBOARD_SUCCESS,
    GROUP_INFO_DASHBOARD_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    grpDashData: [],
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GROUP_INFO_DASHBOARD:
            return { ...state, loading: true, grpDashData: '' };

        case GROUP_INFO_DASHBOARD_SUCCESS:
            return { ...state, loading: false, grpDashData: action.payload };

        case GROUP_INFO_DASHBOARD_FAILURE:
            return { ...state, loading: false, grpDashData: action.payload };

        default:
            return { ...state };
    }
};