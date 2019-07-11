/* 
    Developer : Kevin Ladani
    Date : 21-12-2018
    File Comment : MyAccount PhoneNumber Dashboard Reducer
*/
import {
    PHONE_NUMBER_DASHBOARD,
    PHONE_NUMBER_DASHBOARD_SUCCESS,
    PHONE_NUMBER_DASHBOARD_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    phoneDashData: [],
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
      return INIT_STATE
    }
    switch (action.type) {
        case PHONE_NUMBER_DASHBOARD:
            return { ...state, loading: true, phoneDashData: '' };

        case PHONE_NUMBER_DASHBOARD_SUCCESS:
        case PHONE_NUMBER_DASHBOARD_FAILURE:
            return { ...state, loading: false, phoneDashData: action.payload };

        default:
            return { ...state };
    }
};