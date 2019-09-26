import {
    // Get Top Gainers Data
    GET_TOP_GAINERS_DATA,
    GET_TOP_GAINERS_DATA_SUCCESS,
    GET_TOP_GAINERS_DATA_FAILURE,

    // Action Logout
    ACTION_LOGOUT,
    CLEAR_TOP_GAINER_DATA
} from '../../actions/ActionTypes';

const INITIAL_STATE = {

    //Top Gainer List
    topGainers: null,
    loading: false,
    error: false,
    type: 1,
}

export default function MarginTopGainerReducer(state, action) {
    
    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE;

        // Handle Top Gainer List method data
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

        // Clear Top Gainer Data
        case CLEAR_TOP_GAINER_DATA: {
            return Object.assign({}, state, {
                topGainers: null,
            })
        }
        
        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}