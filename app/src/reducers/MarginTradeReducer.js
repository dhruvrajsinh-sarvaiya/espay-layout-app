// Action types for Margin Trade
import {
    // Action Logout
    ACTION_LOGOUT,

    // Fetch Margin Market List
    FETCH_MARGIN_MARKET_LIST_SUCCESS,
    FETCH_MARGIN_MARKET_LIST_FAILURE,
    FETCH_MARKET_LIST
} from '../actions/ActionTypes';

// Initial state for Margin Trade
const INTIAL_STATE = {

    //Pair List
    marketList: null,
    marketListFilter: null,
    isFetchMarket: false,
    pairListError: false,
}

export default function marginTradeReducer(state = INTIAL_STATE, action) {

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Fetch Market List method data
        case FETCH_MARKET_LIST: {
            return Object.assign({}, state, {
                marketList: null,
                marketListFilter: null,
                isFetchMarket: true,
                pairListError: false
            })
        }
        // Set Fetch Market List success data
        case FETCH_MARGIN_MARKET_LIST_SUCCESS: {
            return Object.assign({}, state, {
                marketList: action.payload,
                marketListFilter: action.payload,
                isFetchMarket: false,
                pairListError: false
            })
        }
        // Set Fetch Market List failure data
        case FETCH_MARGIN_MARKET_LIST_FAILURE: {
            return Object.assign({}, state, {
                marketList: null,
                marketListFilter: null,
                isFetchMarket: false,
                pairListError: true
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}