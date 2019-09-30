import {
    // Get Top Gainer/Loser Data
    GET_TOP_GAINERS_LOSERS_DATA,
    GET_TOP_GAINERS_LOSERS_DATA_SUCCESS,
    GET_TOP_GAINERS_LOSERS_DATA_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Clear Top Gainer Loser Data
    CLEAR_TOP_GAINERS_LOSERS_DATA
} from '../../actions/ActionTypes';

const INITIAL_STATE = {

    //Top Gainer Losers List
    topGainersLosers: null,
    loading: false,
    error: false
}

export default function MarginTopGainerLoserReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Clear Top Gainer Losers Data
        case CLEAR_TOP_GAINERS_LOSERS_DATA: {
            return INITIAL_STATE;
        }

        // Handle Top Gainer Losers method Data
        case GET_TOP_GAINERS_LOSERS_DATA: {
            return Object.assign({}, state, {
                topGainersLosers: null,
                loading: true,
                error: false,
            })
        }
        // Set Top Gainer Losers success data
        case GET_TOP_GAINERS_LOSERS_DATA_SUCCESS: {
            return Object.assign({}, state, {
                topGainersLosers: action.payload,
                loading: false,
                error: false
            })
        }
        // Set Top Gainer Losers failure data
        case GET_TOP_GAINERS_LOSERS_DATA_FAILURE: {
            return Object.assign({}, state, {
                topGainersLosers: null,
                loading: false,
                error: true
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}