// Action types for Trade Chart
import {
    // Get Graph Detail
    GET_GRAPH_DETAILS,
    GET_GRAPH_DETAILS_SUCCESS,
    GET_GRAPH_DETAILS_FAILURE,

    // Action Logout
    ACTION_LOGOUT,
} from '../../actions/ActionTypes';

// Initial state for Graph Detail 
const INTIAL_STATE = {
    //For Graph Details
    graphDetails: null,
    isFetchingGraph: false,
    graphError: false,
}

export default function tradeChartReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INTIAL_STATE;
    }

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Trade Chart method data
        case GET_GRAPH_DETAILS: {
            return Object.assign({}, state, {
                graphDetails: null,
                isFetchingGraph: true,
                graphError: false,
            });
        }
        // Set Trade Chart success data
        case GET_GRAPH_DETAILS_SUCCESS: {
            return Object.assign({}, state, {
                graphDetails: action.data,
                isFetchingGraph: false,
                graphError: false,
            });
        }
        // Set Trade Chart failure data
        case GET_GRAPH_DETAILS_FAILURE: {
            return Object.assign({}, state, {
                graphDetails: null,
                isFetchingGraph: false,
                graphError: true,
            });
        }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}