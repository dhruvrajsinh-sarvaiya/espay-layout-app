// Action types for Charge List
import {
    // Get Charge List
    GET_CHARGES_LIST,
    GET_CHARGES_LIST_SUCCESS,
    GET_CHARGES_LIST_FAILURE,

    // Action Logout
    ACTION_LOGOUT,
} from '../../actions/ActionTypes';

// Initial state for Charge List
const INTIAL_STATE = {

    // Charges List
    chargeList: null,
    isLoading: false,
    chargesError: false,
}

export default function chargeListReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INTIAL_STATE;
    }

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Charge List method data
        case GET_CHARGES_LIST: {
            return Object.assign({}, state, {
                chargeList: null,
                isLoading: true,
                chargesError: false,
            })
        }
        // Set Charge List success data
        case GET_CHARGES_LIST_SUCCESS: {
            return Object.assign({}, state, {
                chargeList: action.payload,
                isLoading: false,
                chargesError: false
            })
        }
        // Set Charge List failure data
        case GET_CHARGES_LIST_FAILURE: {
            return Object.assign({}, state, {
                chargeList: null,
                isLoading: false,
                chargesError: true
            })
        }

        // If no actions were found from reducer then return default [existing] state value
        default: return state;
    }
}