// Action types for Top Loser
import {
    // Get Top Loser Data
    GET_TOP_LOSERS_DATA,
    GET_TOP_LOSERS_DATA_SUCCESS,
    GET_TOP_LOSERS_DATA_FAILURE,

    // Action Logout
    ACTION_LOGOUT,
} from '../../actions/ActionTypes';

// Initial State for Top Loser
const INTIAL_STATE = {

    //Top Losers List
    topLosers: null,
    loading: false,
    error: false,
    type: 1
}

export default function topLoserReducer(state = INTIAL_STATE, action) {

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Top Loser method data
        case GET_TOP_LOSERS_DATA: {
            return Object.assign({}, state, {
                topLosers: null,
                loading: true,
                error: false,
                type: action.payload.type
            })
        }
        // Set Top Loser success data
        case GET_TOP_LOSERS_DATA_SUCCESS: {
            return Object.assign({}, state, {
                topLosers: action.payload,
                loading: false,
                error: false
            })
        }
        // Set Top Loser failure data
        case GET_TOP_LOSERS_DATA_FAILURE: {
            return Object.assign({}, state, {
                topLosers: null,
                loading: false,
                error: true
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}