// Action types for Trade
import {
    // Fetch Market List
    FETCH_MARKET_LIST,
    FETCH_MARKET_LIST_SUCCESS,
    FETCH_MARKET_LIST_FAILURE,

    // Store Base Currency
    STORE_BASE_CURRENCY,

    // Refresh Market List
    REFRESH_MARKET_LIST,

    // Action Logout
    ACTION_LOGOUT,

    // Clear Market List
    CLEAR_MARKET_LIST
} from '../actions/ActionTypes';

// Initial state for Trade
const INTIAL_STATE = {

    //Pair List
    marketList: null,
    marketListFilter: null,
    isFetchMarket: false,
    pairListError: false,

    //To store base currency
    baseCurrency: '',

    //To store selected pairName
    pairName: '',
}

export default function tradeReducer(state = INTIAL_STATE, action) {

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Clear Market List Data
        case CLEAR_MARKET_LIST: {
            return Object.assign({}, state, {
                marketListFilter: null,
            });
        }

        // Handle Market List method data
        case FETCH_MARKET_LIST: {
            return Object.assign({}, state, {
                marketList: null,
                marketListFilter: null,
                isFetchMarket: true,
                pairListError: false
            })
        }
        // Set Market List success data
        case FETCH_MARKET_LIST_SUCCESS: {
            return Object.assign({}, state, {
                marketList: action.payload,
                marketListFilter: action.payload,
                isFetchMarket: false,
                pairListError: false
            })
        }
        // Set Market List failure data
        case FETCH_MARKET_LIST_FAILURE: {
            return Object.assign({}, state, {
                marketList: null,
                marketListFilter: null,
                isFetchMarket: false,
                pairListError: true
            })
        }

        // Handle Refresh Market List method data
        case REFRESH_MARKET_LIST: {
            return Object.assign({}, state, {
                marketList: action.payload,
                marketListFilter: action.payload,
            })
        }

        //To store base currency
        case STORE_BASE_CURRENCY: {
            return Object.assign({}, state, {
                baseCurrency: action.payload
            })
        }
        
        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}