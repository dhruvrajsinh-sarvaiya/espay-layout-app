/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Application Dashboard Reducers
*/
import {
    APPLICATION_DASHBOARD,
    APPLICATION_DASHBOARD_SUCCESS,
    APPLICATION_DASHBOARD_FAILURE,

    ADD_APPLICATION,
    ADD_APPLICATION_SUCCESS,
    ADD_APPLICATION_FAILURE,

    LIST_APPLICATION,
    LIST_APPLICATION_SUCCESS,
    LIST_APPLICATION_FAILURE,

    LIST_ACTIVE_APPLICATION,
    LIST_ACTIVE_APPLICATION_SUCCESS,
    LIST_ACTIVE_APPLICATION_FAILURE,

    LIST_INACTIVE_APPLICATION,
    LIST_INACTIVE_APPLICATION_SUCCESS,
    LIST_INACTIVE_APPLICATION_FAILURE,

    ACTIVE_APPLICATION,
    ACTIVE_APPLICATION_SUCCESS,
    ACTIVE_APPLICATION_FAILURE,

    INACTIVE_APPLICATION,
    INACTIVE_APPLICATION_SUCCESS,
    INACTIVE_APPLICATION_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INITIAL_STATE = {
    appDashData: [],
    addApplicationData: {},
    ListTotalApplicationData: {},
    ActiveApplicationData: {},
    InActiveApplicationData: {},
    activeApp: {},
    inActiveApp: {},
    loading: false,
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        case APPLICATION_DASHBOARD:
            return { ...state, loading: true, appDashData: {}, addApplicationData: {} };

        case APPLICATION_DASHBOARD_SUCCESS:
        case APPLICATION_DASHBOARD_FAILURE:
            return { ...state, loading: false, appDashData: action.payload, addApplicationData: {} };

        case ADD_APPLICATION:
            return { ...state, loading: true, addApplicationData: {} };

        case ADD_APPLICATION_SUCCESS:
        case ADD_APPLICATION_FAILURE:
            return { ...state, loading: false, addApplicationData: action.payload };

        case LIST_APPLICATION:
            return { ...state, loading: true, ListTotalApplicationData: {}, inActiveApp: {}, activeApp: {} };

        case LIST_APPLICATION_SUCCESS:
        case LIST_APPLICATION_FAILURE:
            return { ...state, loading: false, ListTotalApplicationData: action.payload };

        case LIST_ACTIVE_APPLICATION:
            return { ...state, loading: true, ActiveApplicationData: {}, inActiveApp: {} };

        case LIST_ACTIVE_APPLICATION_SUCCESS:
        case LIST_ACTIVE_APPLICATION_FAILURE:
            return { ...state, loading: false, ActiveApplicationData: action.payload };

        case LIST_INACTIVE_APPLICATION:
            return { ...state, loading: true, InActiveApplicationData: {}, activeApp: {} };

        case LIST_INACTIVE_APPLICATION_SUCCESS:
        case LIST_INACTIVE_APPLICATION_FAILURE:
            return { ...state, loading: false, InActiveApplicationData: action.payload };

        case ACTIVE_APPLICATION:
            return { ...state, loading: true, activeApp: {}, inActiveApp: {} };

        case ACTIVE_APPLICATION_SUCCESS:
        case ACTIVE_APPLICATION_FAILURE:
            return { ...state, loading: false, activeApp: action.payload };

        case INACTIVE_APPLICATION:
            return { ...state, loading: true, inActiveApp: {}, activeApp: {} };

        case INACTIVE_APPLICATION_SUCCESS:
        case INACTIVE_APPLICATION_FAILURE:
            return { ...state, loading: false, inActiveApp: action.payload };

        default:
            return { ...state };
    }
};