import {
    // Login History List
    LOGIN_HISTORY_LIST,
    LOGIN_HISTORY_LIST_SUCCESS,
    LOGIN_HISTORY_LIST_FAILURE,

    // Clear data
    ACTION_LOGOUT
} from "../../actions/ActionTypes";

const initialState = {

    // Initial State For Login History Data
    LoginHistorydata: null,
    LoginIsFetching: false,
}

const LoginHistoryReducer = (state, action) => {

    // If state is undefine then return with initial state		
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState;

        // Handle Login History List method data
        case LOGIN_HISTORY_LIST:
            return Object.assign({}, state, {
                LoginIsFetching: true,
                LoginHistorydata: null
            })
        // Set Login History List success data
        case LOGIN_HISTORY_LIST_SUCCESS:
            return Object.assign({}, state, {
                LoginIsFetching: false,
                LoginHistorydata: action.payload
            })
        // Set Login History List failure data
        case LOGIN_HISTORY_LIST_FAILURE:
            return Object.assign({}, state, {
                LoginIsFetching: false,
                LoginHistorydata: action.payload
            });

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default LoginHistoryReducer;



