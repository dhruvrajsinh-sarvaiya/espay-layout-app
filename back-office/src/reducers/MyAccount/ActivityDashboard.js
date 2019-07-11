/* 
    Developer : Kevin Ladani
    Date : 21-12-2018
    File Comment : MyAccount Activity Dashboard Reducer
*/
import {
    ACTIVITY_DASHBOARD,
    ACTIVITY_DASHBOARD_SUCCESS,
    ACTIVITY_DASHBOARD_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    activityDashData: [],
    loading: false
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
      }
    switch (action.type) {
        case ACTIVITY_DASHBOARD:
            return { ...state, loading: true, activityDashData: '' };

        case ACTIVITY_DASHBOARD_SUCCESS:
            return { ...state, loading: false, activityDashData: action.payload };

        case ACTIVITY_DASHBOARD_FAILURE:
            return { ...state, loading: false, activityDashData: action.payload };

        default:
            return { ...state };
    }
};