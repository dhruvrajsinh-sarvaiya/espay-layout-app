import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Arbitrage Exchange Balance List
    GET_ARBI_EXCHANGE_BAL_LIST,
    GET_ARBI_EXCHANGE_BAL_LIST_SUCCESS,
    GET_ARBI_EXCHANGE_BAL_LIST_FAILURE,

    // Clear data
    CLEAR_ARBI_EXCHANGE_BAL_DATA,

    // Provider list
    GET_ARBITRAGE_PROVIDER_LIST,
    GET_ARBITRAGE_PROVIDER_LIST_SUCCESS,
    GET_ARBITRAGE_PROVIDER_LIST_FAILURE,

    // Currency list
    GET_ARBITRAGE_CURRENCY_LIST,
    GET_ARBITRAGE_CURRENCY_LIST_SUCCESS,
    GET_ARBITRAGE_CURRENCY_LIST_FAILURE
} from "../../actions/ActionTypes";

// Initial State for Arbitrage Exchange Bal
const INITIAL_STATE = {
    // for Arbitrage Exchange Bal List
    ArbitrageExchangeBalList: null,
    ArbitrageExchangeBalLoading: false,
    ArbitrageExchangeBalError: false,

    // for Arbitrage Provider List
    ArbitrageProviderList: null,
    ArbitrageProviderLoading: false,
    ArbitrageProviderError: false,

    // Arbitrage Currency List
    ArbitrageCurrencyList: null,
    ArbitrageCurrencyLoading: false,
    ArbitrageCurrencyError: false,
}

export default function ArbitrageExchangeBalReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Arbitrage Exchange Bal List method data
        case GET_ARBI_EXCHANGE_BAL_LIST:
            return Object.assign({}, state, {
                ArbitrageExchangeBalList: null,
                ArbitrageExchangeBalLoading: true
            })
        // Set Arbitrage Exchange Bal List success data
        case GET_ARBI_EXCHANGE_BAL_LIST_SUCCESS:
            return Object.assign({}, state, {
                ArbitrageExchangeBalList: action.data,
                ArbitrageExchangeBalLoading: false,
            })
        // Set Arbitrage Exchange Bal List failure data
        case GET_ARBI_EXCHANGE_BAL_LIST_FAILURE:
            return Object.assign({}, state, {
                ArbitrageExchangeBalList: null,
                ArbitrageExchangeBalLoading: false,
                ArbitrageExchangeBalError: true
            })

        // Clear Arbitrage Exchange Bal method data
        case CLEAR_ARBI_EXCHANGE_BAL_DATA:
            return Object.assign({}, state, {
                ArbitrageExchangeBalList: null,
            })

        // Handle Arbitrage Provider List method data
        case GET_ARBITRAGE_PROVIDER_LIST:
            return Object.assign({}, state, {
                ArbitrageProviderList: null,
                ArbitrageProviderLoading: true
            })
        // Set Arbitrage Provider List success data
        case GET_ARBITRAGE_PROVIDER_LIST_SUCCESS:
            return Object.assign({}, state, {
                ArbitrageProviderList: action.payload,
                ArbitrageProviderLoading: false,
            })
        // Set Arbitrage Provider List failure data
        case GET_ARBITRAGE_PROVIDER_LIST_FAILURE:
            return Object.assign({}, state, {
                ArbitrageProviderList: null,
                ArbitrageProviderLoading: false,
                ArbitrageProviderError: true
            })

        // Handle Arbitrage Currency List method data
        case GET_ARBITRAGE_CURRENCY_LIST:
            return Object.assign({}, state, {
                ArbitrageCurrencyList: null,
                ArbitrageCurrencyLoading: true
            })
        // Set Arbitrage Currency List success data
        case GET_ARBITRAGE_CURRENCY_LIST_SUCCESS:
            return Object.assign({}, state, {
                ArbitrageCurrencyList: action.payload,
                ArbitrageCurrencyLoading: false,
            })
        // Set Arbitrage Currency List failure data
        case GET_ARBITRAGE_CURRENCY_LIST_FAILURE:
            return Object.assign({}, state, {
                ArbitrageCurrencyList: null,
                ArbitrageCurrencyLoading: false,
                ArbitrageCurrencyError: true
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}