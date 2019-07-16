// Action types for NewSection 
import {
    // News Section Fetch
    NEWSSECTION_FETCH,
    NEWSSECTION_FETCH_SUCCESS,
    NEWSSECTION_FETCH_FAILURE,

    // Clear News Section Data
    CLEAR_NEWSSECTION_DATA,

    // Action Logout
    ACTION_LOGOUT
} from '../actions/ActionTypes'

// Initial state for News Section
const INTIAL_STATE = {
    isNewsFetch: false,
    newsdata: null,
    newsdatafetch: true,
}
export default function NewsSectionReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INTIAL_STATE;
    }
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle NewsSection Fetch method data
        case NEWSSECTION_FETCH:
            return {
                ...state,
                isNewsFetch: true,
                newsdata: null,
                newsdatafetch: true,
            }
        // Set NewsSection Fetch success data
        case NEWSSECTION_FETCH_SUCCESS:
            return {
                ...state,
                isNewsFetch: false,
                newsdata: action.data,
                newsdatafetch: false,
            }
        // Set NewsSection Fetch failure data
        case NEWSSECTION_FETCH_FAILURE:
            return {
                ...state,
                isNewsFetch: false,
                newsdata: null,
                newsdatafetch: false,
            }

        // Clear NewsSection Data
        case CLEAR_NEWSSECTION_DATA:
            return INTIAL_STATE;

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
} 