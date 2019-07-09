// Action types for Api Key Delete
import {
    // Delete API Key
    DELETE_API_KEY,
    DELETE_API_KEY_SUCCESS,
    DELETE_API_KEY_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Cleare Delete Api Key
    CLEAR_DELETE_API_KEY_DATA
} from "../../actions/ActionTypes";

// Initial state for Api Key Delete
const INITIAL_STATE = {
    // Delete Api Key
    deleteApiKeyData: null,
    deleteApiKeyLoading: false,
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // To clear delete api key data
        case CLEAR_DELETE_API_KEY_DATA:
            return {
                deleteApiKeyData: null,
                deleteApiKeyLoading: false,
            };

        // Handle delete api key method data
        case DELETE_API_KEY:
            return {
                ...state,
                deleteApiKeyData: null,
                deleteApiKeyLoading: true,
            };
        // Set delete api key success data
        case DELETE_API_KEY_SUCCESS:
            return {
                ...state,
                deleteApiKeyData: action.payload,
                deleteApiKeyLoading: false,
            };
        // Set delete api key failure data
        case DELETE_API_KEY_FAILURE:
            return {
                ...state,
                deleteApiKeyData: null,
                deleteApiKeyLoading: false,
            };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
};
