import {
    // Get Top Losers Data
    GET_TOP_LOSERS_DATA,
    GET_TOP_LOSERS_DATA_SUCCESS,
    GET_TOP_LOSERS_DATA_FAILURE,

    // Action Logout
    ACTION_LOGOUT,
    CLEAR_TOP_LOSER_DATA
} from '../../actions/ActionTypes';

const INITIAL_STATE = {

    //Top Losers List
    topLosers: null,
    loading: false,
    error: false,
    type: 1,
}

export default function MarginTopLoserReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE;

        // Handle Top Losers List method data
        case GET_TOP_LOSERS_DATA: {
            return Object.assign({}, state, {
                topLosers: null,
                loading: true,
                error: false,
                type: action.payload.type
            })
        }
        // Set Top Losers success data
        case GET_TOP_LOSERS_DATA_SUCCESS: {
            return Object.assign({}, state, {
                topLosers: action.payload,
                loading: false,
                error: false
            })
        }
        // Set Top Losers failure data
        case GET_TOP_LOSERS_DATA_FAILURE: {
            return Object.assign({}, state, {
                topLosers: null,
                loading: false,
                error: true
            })
        }

        // Clear Top Loser Data
        case CLEAR_TOP_LOSER_DATA: {
            return Object.assign({}, state, {
                topLosers: null,
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}