// Action type for Personal Identification Verification Module
import {
    // Personal Identification
    PERSONAL_VERIFICATION,
    PERSONAL_VERIFICATION_SUCCESS,
    PERSONAL_VERIFICATION_FAILURE,

    // Action Logout 
    ACTION_LOGOUT
} from '../actions/ActionTypes';

// Initial state for Personal Identification Verification Module
const INITIAL_STATE = {
    // Personal Identification
    loading: false,
    data: '',
    dataFetch: true,
}

//Check Action for Personal Verification Form...
export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE;

        // Handle personal verification method data
        case PERSONAL_VERIFICATION:
            return { ...state, loading: true, data: '', dataFetch: true };
        // Set personal verification success data
        case PERSONAL_VERIFICATION_SUCCESS:
            return { ...state, loading: false, data: action.payload, dataFetch: false };
        // Set personal verification failure data
        case PERSONAL_VERIFICATION_FAILURE:
            return { ...state, loading: false, data: action.payload, dataFetch: false };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}