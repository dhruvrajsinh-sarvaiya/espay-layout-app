// Action types for Activity Log Module
import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Activity Log List
    GET_ACTIVITY_LOG_LIST,
    GET_ACTIVITY_LOG_LIST_SUCCESS,
    GET_ACTIVITY_LOG_LIST_FAILURE,

    // Get Module Type
    GET_MODULE_TYPE,
    GET_MODULE_TYPE_SUCCESS,
    GET_MODULE_TYPE_FAILURE,
} from "../actions/ActionTypes";

// Initial state for Activity Log Module
const INITIAL_STATE = {

    // Activity Log
    ActivityLogData: null,
    ActivityLogLoading: false,
    ActivityLogError: false,

    // Module Type
    ModuleTypeData: null,
    ModuleTypeLoading: false,
    ModuleTypeError: false,
}

export default function ActivityLogReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle activity log list method data
        case GET_ACTIVITY_LOG_LIST:
            return Object.assign({}, state, {
                ActivityLogData: null,
                ActivityLogLoading: true
            })
        // Set activity log list success data
        case GET_ACTIVITY_LOG_LIST_SUCCESS:
            return Object.assign({}, state, {
                ActivityLogData: action.data,
                ActivityLogLoading: false
            })
        // Set activity log list failure data
        case GET_ACTIVITY_LOG_LIST_FAILURE:
            return Object.assign({}, state, {
                ActivityLogData: null,
                ActivityLogLoading: false,
                ActivityLogError: true
            })

        // Handle module type method data
        case GET_MODULE_TYPE:
            return Object.assign({}, state, {
                ModuleTypeData: null,
                ModuleTypeLoading: true
            })
        // Set module type success data
        case GET_MODULE_TYPE_SUCCESS:
            return Object.assign({}, state, {
                ModuleTypeData: action.data,
                ModuleTypeLoading: false
            })
        // Set module type failure data
        case GET_MODULE_TYPE_FAILURE:
            return Object.assign({}, state, {
                ModuleTypeData: null,
                ModuleTypeLoading: false,
                ModuleTypeError: true
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}