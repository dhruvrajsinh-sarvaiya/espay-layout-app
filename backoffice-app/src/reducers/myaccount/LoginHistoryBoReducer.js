import {
    // Clear data
    ACTION_LOGOUT,
    LOGIN_HISTORY_LIST_BO_CLEAR,

    // Login History List
    LOGIN_HISTORY_LIST_BO,
    LOGIN_HISTORY_LIST_BO_SUCCESS,
    LOGIN_HISTORY_LIST_BO_FAILURE,
} from "../../actions/ActionTypes";

const INITIAL_STATE = {
    // Initial State For Login History Data
    LoginHistorydata: null,
    LoginIsFetching: false,
}

export default function LoginHistoryBoReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        //Handle login history list method data
        case LOGIN_HISTORY_LIST_BO:
            return Object.assign({}, state, {
                LoginIsFetching: true,
                LoginHistorydata: null
            });
        //Set login history list method success data
        case LOGIN_HISTORY_LIST_BO_SUCCESS:
            return Object.assign({}, state, {
                LoginIsFetching: false,
                LoginHistorydata: action.payload
            })
        //Set login history list method failure data
        case LOGIN_HISTORY_LIST_BO_FAILURE:
            return Object.assign({}, state, {
                LoginIsFetching: false,
                LoginHistorydata: action.payload
            });

        // To reset initial state on clear data
        case LOGIN_HISTORY_LIST_BO_CLEAR:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}