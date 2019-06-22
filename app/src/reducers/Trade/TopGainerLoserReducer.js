// Action types for Top Gainer Loser Data
import {
    // Get Top Gainer/Losers Data
    GET_TOP_GAINERS_LOSERS_DATA,
    GET_TOP_GAINERS_LOSERS_DATA_SUCCESS,
    GET_TOP_GAINERS_LOSERS_DATA_FAILURE,

    // Clear Top Gainer Losers Data
    CLEAR_TOP_GAINERS_LOSERS_DATA,

    // Action Logout
    ACTION_LOGOUT,
} from '../../actions/ActionTypes';

// Initial State for Top Gainer Losers 
const INTIAL_STATE = {

    //Top Gainer Losers List
    topGainersLosers: null,
    loading: false,
    error: false
}

export default function topGainerLoserReducer(state = INTIAL_STATE, action) {

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // To reset initial state on clear method
        case CLEAR_TOP_GAINERS_LOSERS_DATA: {
            return INTIAL_STATE;
        }

        // Handle Top Gainer Loser method data
        case GET_TOP_GAINERS_LOSERS_DATA: {
            return Object.assign({}, state, {
                topGainersLosers: null,
                loading: true,
                error: false,
            })
        }
        // Set Top Gainer Loser success data
        case GET_TOP_GAINERS_LOSERS_DATA_SUCCESS: {
            return Object.assign({}, state, {
                topGainersLosers: action.payload,
                loading: false,
                error: false
            })
        }
        // Set Top Gainer Loser failure data
        case GET_TOP_GAINERS_LOSERS_DATA_FAILURE: {
            return Object.assign({}, state, {
                topGainersLosers: null,
                loading: false,
                error: true
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}