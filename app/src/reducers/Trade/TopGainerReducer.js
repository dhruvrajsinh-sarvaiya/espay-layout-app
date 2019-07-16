// Action types for Top Gainer
import {
    // Get Top Gainer Data
    GET_TOP_GAINERS_DATA,
    GET_TOP_GAINERS_DATA_SUCCESS,
    GET_TOP_GAINERS_DATA_FAILURE,

    // Action Logout
    ACTION_LOGOUT,
} from '../../actions/ActionTypes';

// Initial State for Top Gainer
const initialState = {

    //Top Gainer List
    topGainers: null,
    loading: false,
    error: false,
    type: 1
}

export default function topGainerReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return initialState;
        }

        // Handle Top Gainer method data
        case GET_TOP_GAINERS_DATA: {
            return Object.assign({}, state, {
                topGainers: null,
                loading: true,
                error: false,
                type: action.payload.type
            })
        }
        // Set Top Gainer success data
        case GET_TOP_GAINERS_DATA_SUCCESS: {
            return Object.assign({}, state, {
                topGainers: action.payload,
                loading: false,
                error: false
            })
        }
        // Set Top Gainer failure data
        case GET_TOP_GAINERS_DATA_FAILURE: {
            return Object.assign({}, state, {
                topGainers: null,
                loading: false,
                error: true
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}