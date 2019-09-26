import {
    // Action Logout
    ACTION_LOGOUT,

    // Clear Provider Wallet Data
    CLEAR_PROVIDER_WALLET_DATA,

    // Get Provider Wallet List
    GET_PROVIDER_WALLET_LIST,
    GET_PROVIDER_WALLET_LIST_SUCCESS,
    GET_PROVIDER_WALLET_LIST_FAILURE,

    // Get Arbitrage Provider List
    GET_ARBITRAGE_PROVIDER_LIST,
    GET_ARBITRAGE_PROVIDER_LIST_SUCCESS,
    GET_ARBITRAGE_PROVIDER_LIST_FAILURE,

    // Get Arbitrage Currency List
    GET_ARBITRAGE_CURRENCY_LIST,
    GET_ARBITRAGE_CURRENCY_LIST_SUCCESS,
    GET_ARBITRAGE_CURRENCY_LIST_FAILURE
} from "../../actions/ActionTypes";

// Initial State for Provider Wallet
const INITIAL_STATE = {
    // for Provider Wallet List
    ProviderWalletList: null,
    ProviderWalletLoading: false,
    ProviderWalletError: false,

    // for Arbitrage Provider List
    ArbitrageProviderList: null,
    ArbitrageProviderLoading: false,
    ArbitrageProviderError: false,

    // Arbitrage Currency List
    ArbitrageCurrencyList: null,
    ArbitrageCurrencyLoading: false,
    ArbitrageCurrencyError: false,
}

export default function ProviderWalletReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Provider Wallet List method data
        case GET_PROVIDER_WALLET_LIST:
            return Object.assign({}, state, {
                ProviderWalletList: null,
                ProviderWalletLoading: true
            })
        // Set Provider Wallet List success data
        case GET_PROVIDER_WALLET_LIST_SUCCESS:
            return Object.assign({}, state, {
                ProviderWalletList: action.data,
                ProviderWalletLoading: false,
            })
        // Set Provider Wallet List failure data
        case GET_PROVIDER_WALLET_LIST_FAILURE:
            return Object.assign({}, state, {
                ProviderWalletList: null,
                ProviderWalletLoading: false,
                ProviderWalletError: true
            })

        // Clear Provider Wallet method data
        case CLEAR_PROVIDER_WALLET_DATA:
            return Object.assign({}, state, {
                ProviderWalletList: null,
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