// Action type for Forgot Password
import {
    // Action Logout
    ACTION_LOGOUT,

    // Forgot Password
    FORGOT_PASSWORD,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAILURE,
} from '../actions/ActionTypes'

// Initial state for Forgot Password
const INITIAL_STATE = {
    //for forgot password
    ForgotPasswordFetchData: true,
    ForgotPasswordisFetching: false,
    ForgotPassworddata: '',
}

export default function ForgotPasswordReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE;

        // Handle forgot password method data
        case FORGOT_PASSWORD:
            return {
                ...state,
                ForgotPasswordFetchData: true,
                ForgotPasswordisFetching: true,
                ForgotPassworddata: null
            };
        // Set forgot password success data
        case FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                ForgotPasswordFetchData: false,
                ForgotPasswordisFetching: false,
                ForgotPassworddata: action.payload
            };
        // Set forgot password failure data
        case FORGOT_PASSWORD_FAILURE:
            return {
                ...state,
                ForgotPasswordFetchData: false,
                ForgotPasswordisFetching: false,
                ForgotPassworddata: action.payload,
            };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
} 