// Action types for ContactUs
import {
    // Add new contactus
    ADD_NEW_CONTACTUS,
    ADD_CONTACTUS_SUCCESS,
    ADD_CONTACTUS_FAILURE,

    // Clear Contact Us
    CONTACTUS_CLEARDATA,

    // Action Logout
    ACTION_LOGOUT
} from '../actions/ActionTypes';

// Initial state for ContactUs
const INTIAL_STATE = {
    loading: false,
    addUpdateStatus: null,
    errors: {}
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INTIAL_STATE;
    }

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle ContactUs method data
        case ADD_NEW_CONTACTUS:
            return { ...state, loading: true };

        // Set ContactUs success data
        case ADD_CONTACTUS_SUCCESS:
            return { ...state, loading: false, addUpdateStatus: action.payload };

        // Set ContactUs failure data
        case ADD_CONTACTUS_FAILURE:
            return { ...state, loading: false, data: action.payload };

        // Clear ContactUs Data
        case CONTACTUS_CLEARDATA:
            return { ...state, loading: false, addUpdateStatus: null };

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}
