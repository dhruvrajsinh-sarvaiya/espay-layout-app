// Action types for Pair Rates
import {
    // Get Pair Rates
    GET_PAIR_RATES,
    GET_PAIR_RATES_SUCCESS,
    GET_PAIR_RATES_FAILURE,

    // Action Logout
    ACTION_LOGOUT
} from '../../actions/ActionTypes';

// Initial State for Pair Rates
const INTIAL_STATE = {
    //For PairRates
    pairRates: null,
    isFetchingPairRates: false,
    pairRatesError: false,
}

export default function pairRatesReducer(state = INTIAL_STATE, action) {

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Pair Rates method data
        case GET_PAIR_RATES: {
            return Object.assign({}, state, {
                pairRates: null,
                isFetchingPairRates: true,
                pairRatesError: false,
            })
        }
        // Set Pair Rates success data
        case GET_PAIR_RATES_SUCCESS: {
            return Object.assign({}, state, {
                pairRates: action.data,
                isFetchingPairRates: false,
                pairRatesError: false,
            })
        }
        // Set Pair Rates failure data
        case GET_PAIR_RATES_FAILURE: {
            return Object.assign({}, state, {
                pairRates: null,
                isFetchingPairRates: false,
                pairRatesError: true,
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}