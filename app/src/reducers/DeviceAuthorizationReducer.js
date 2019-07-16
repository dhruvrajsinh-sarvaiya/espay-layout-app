// Action types for Activity Log Module
import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Device Authorization
    DEVICE_AUTHORIZE,
    DEVICE_AUTHORIZE_SUCCESS,
    DEVICE_AUTHORIZE_FAILURE
} from "../actions/ActionTypes";

// Initial state for Device Authorization Module
const INITIAL_STATE = {

    // Device Authorization
    data: '',
    isLoading: false,
}

export default function DeviceAuthorizationReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }
        // Handle Device Authorized method data
        case DEVICE_AUTHORIZE:
            return Object.assign({}, state, {
                isLoading: true,
                data: ''
            });

        // Set Device Authorized success data
        case DEVICE_AUTHORIZE_SUCCESS:
            return Object.assign({}, state, {
                isLoading: false,
                data: action.payload
            });

        // Set Device Authorized failure data
        case DEVICE_AUTHORIZE_FAILURE:
            return Object.assign({}, state, {
                isLoading: false,
                data: action.payload,
            });

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}