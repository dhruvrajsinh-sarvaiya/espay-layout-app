// Action types for Login History
import {
    // Login History List
    LOGIN_HISTORY_LIST,
    LOGIN_HISTORY_LIST_SUCCESS,
    LOGIN_HISTORY_LIST_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Clear login history
    CLEAR_LOGIN_HISTORY,

    // Login History Widget Sucess
    LOGIN_HISTORY_WIDGET_SUCCESS
} from "../actions/ActionTypes";

// Initial State For Login History Data
const INITIAL_STATE = {

    // Login History List
    LoginHistorydata: null,
    LoginIsFetching: false,
    LoginHistoryWidgetData: null,
}

const LoginHistoryReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle login history list method data
        case LOGIN_HISTORY_LIST:
            return Object.assign({}, state, {
                LoginIsFetching: true,
                LoginHistorydata: null,
            });
        // Set login history list success data
        case LOGIN_HISTORY_LIST_SUCCESS:
            return Object.assign({}, state, {
                LoginIsFetching: false,
                LoginHistorydata: action.payload,
            });
        // Set login history widget success data
        case LOGIN_HISTORY_WIDGET_SUCCESS:
            return Object.assign({}, state, {
                LoginHistoryWidgetData: action.payload
            });
        // Set login history widget failure data
        case LOGIN_HISTORY_LIST_FAILURE:
            return Object.assign({}, state, {
                LoginIsFetching: false,
                LoginHistorydata: action.payload,
                LoginHistoryWidgetData: action.payload
            });

        // Clear login history data
        case CLEAR_LOGIN_HISTORY:
            return Object.assign({}, state, {
                LoginIsFetching: false,
                LoginHistorydata: null
            });
            
        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default LoginHistoryReducer;



