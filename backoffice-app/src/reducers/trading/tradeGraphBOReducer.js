import {
    // Get Graph Detail
    GET_GRAPH_DETAIL,
    GET_GRAPH_DETAIL_SUCCCESS,
    GET_GRAPH_DETAIL_FAILURE,

    // Clear Data
    ACTION_LOGOUT
} from '../../actions/ActionTypes';

const initialState = {

    //Trade Graph Data
    graphData: null,
    isLoading: false,
    error: false
}

export default function tradeGraphBOReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return initialState;
        }

        // Handle Trade Graph method data 
        case GET_GRAPH_DETAIL: {
            return Object.assign({}, state, {
                graphData: null,
                isLoading: true,
                error: false,
            })
        }
        // Set Trade Graph success data 
        case GET_GRAPH_DETAIL_SUCCCESS: {
            return Object.assign({}, state, {
                graphData: action.payload,
                isLoading: false,
                error: false
            })
        }
        // Set Trade Graph failure data 
        case GET_GRAPH_DETAIL_FAILURE: {
            return Object.assign({}, state, {
                graphData: null,
                isLoading: false,
                error: true
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}