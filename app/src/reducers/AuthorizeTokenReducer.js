// Action types for Authorized Token
import {
    // Generate Token
    GENERATE_TOKEN,
    GENERATE_TOKEN_SUCCESS,
    GENERATE_TOKEN_FAILURE,

    // Refresh Token
    REFRESH_TOKEN,
    REFRESH_TOKEN_SUCCESS,
    REFRESH_TOKEN_FAILURE,

    // Check Token
    CHECK_TOKEN,
    CHECK_TOKEN_SUCCESS,
    CHECK_TOKEN_FAILURE,

    // Clear Generate Token Data
    CLEAR_GENERATE_TOKEN_DATA,

    // Action Logout
    ACTION_LOGOUT,
} from '../actions/ActionTypes';

// Initial state for Authorize Token
const INTIAL_STATE = {

    //Generate Token
    generateToken: null,
    isGenerating: false,
    generateTokenError: false,

    //Refresh Token
    refreshToken: null,
    isRefreshing: false,
    refreshTokenError: false,

    //Check Token
    checkToken: null,
    isChecking: false,
    checkTokenError: false,
}

export default function AuthorizeTokenReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INTIAL_STATE;
    }

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Generate Token method data
        case GENERATE_TOKEN: {
            return Object.assign({}, state, {
                generateToken: null,
                isGenerating: true,
                generateTokenError: false,
            })
        }
        // Set Generate Token success data
        case GENERATE_TOKEN_SUCCESS: {
            return Object.assign({}, state, {
                generateToken: action.payload,
                isGenerating: false,
                generateTokenError: false,
            })
        }
        // Set Generate Token failure data
        case GENERATE_TOKEN_FAILURE: {
            return Object.assign({}, state, {
                generateToken: null,
                isGenerating: false,
                generateTokenError: true
            })
        }

        // Handle Refresh Token method data
        case REFRESH_TOKEN: {
            return Object.assign({}, state, {
                refreshToken: null,
                isRefreshing: true,
                refreshTokenError: false,
            })
        }
        // Set Refresh Token success data
        case REFRESH_TOKEN_SUCCESS: {
            return Object.assign({}, state, {
                refreshToken: action.payload,
                isRefreshing: false,
                refreshTokenError: false
            })
        }
        // Set Refresh Token failure data
        case REFRESH_TOKEN_FAILURE: {
            return Object.assign({}, state, {
                refreshToken: null,
                isRefreshing: false,
                refreshTokenError: true
            })
        }

        // Handle Check Token method data
        case CHECK_TOKEN: {
            return Object.assign({}, state, {
                checkToken: null,
                isChecking: true,
                checkTokenError: false,
            })
        }
        // Set Check Token success data
        case CHECK_TOKEN_SUCCESS: {
            return Object.assign({}, state, {
                checkToken: action.payload,
                isChecking: false,
                checkTokenError: false
            })
        }
        // Set Check Token failure data
        case CHECK_TOKEN_FAILURE: {
            return Object.assign({}, state, {
                checkToken: null,
                isChecking: false,
                checkTokenError: true
            })
        }

        // Clear Generate Token Data
        case CLEAR_GENERATE_TOKEN_DATA: {
            return Object.assign({}, state, {
                generateToken: null,
                isGenerating: false,
                generateTokenError: false,
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}