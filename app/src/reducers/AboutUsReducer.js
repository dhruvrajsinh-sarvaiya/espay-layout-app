// Action types for About us
import {
    // About Us Data
    ABOUTUS_FETCH_DATA,
    ABOUTUS_SUCCESS,
    ABOUTUS_FAILURE,

    // Action Logout
    ACTION_LOGOUT
} from '../actions/ActionTypes'

// Initial state for About Us
const INTIAL_STATE = {
    // About Us Data
    isdatafetch: false,
    URL: null,
}

export default function AboutUsReducer(state = INTIAL_STATE, action) {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle About Us Data method data
        case ABOUTUS_FETCH_DATA:
            return {
                ...state,
                isdatafetch: false,
                URL: null
            }
        // Set About Us Data success data
        case ABOUTUS_SUCCESS:
            return {
                ...state,
                isdatafetch: true,
                URL: action.data
            }
        // Set About Us Data failure data
        case ABOUTUS_FAILURE:
            return {
                ...state,
                isdatafetch: false,
                URL: null
            }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
} 