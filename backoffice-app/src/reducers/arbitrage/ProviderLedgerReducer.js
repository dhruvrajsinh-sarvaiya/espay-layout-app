import {
    // Get Provider Ledger Data
    GET_PROVIDER_LEDGER_DATA,
    GET_PROVIDER_LEDGER_DATA_SUCCESS,
    GET_PROVIDER_LEDGER_DATA_FAILURE,

    // Get Arbitrage Currency List
    GET_ARBITRAGE_CURRENCY_LIST,
    GET_ARBITRAGE_CURRENCY_LIST_SUCCESS,
    GET_ARBITRAGE_CURRENCY_LIST_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Clear Provider Ledger Data
    CLEAR_PROVIDER_LEDGER_DATA,

    // Get Provider Wallet List
    GET_PROVIDER_WALLET_LIST,
    GET_PROVIDER_WALLET_LIST_SUCCESS,
    GET_PROVIDER_WALLET_LIST_FAILURE
} from "../../actions/ActionTypes";

// Initial State for Provider Ledger
const INITIAL_STATE = {
    ProviderLedgerList: null,
    ProviderLedgerLoading: false,
    ProviderLedgerError: false,

    // Arbitrage Currency List
    ArbitrageCurrencyList: null,
    ArbitrageCurrencyLoading: false,
    ArbitrageCurrencyError: false,

    // for Provider Wallet List
    ProviderWalletList: null,
    ProviderWalletLoading: false,
    ProviderWalletError: false,
}

export default function ProviderLedgerReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Provider Ledger method data
        case GET_PROVIDER_LEDGER_DATA:
            return Object.assign({}, state, {
                ProviderLedgerList: null,
                ProviderLedgerLoading: true
            })
        // Set Provider Ledger success data
        case GET_PROVIDER_LEDGER_DATA_SUCCESS:
            return Object.assign({}, state, {
                ProviderLedgerList: action.data,
                ProviderLedgerLoading: false,
            })
        // Set Provider Ledger failure data
        case GET_PROVIDER_LEDGER_DATA_FAILURE:
            return Object.assign({}, state, {
                ProviderLedgerList: null,
                ProviderLedgerLoading: false,
                ProviderLedgerError: true
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

        // Clear Provider Ledger method data
        case CLEAR_PROVIDER_LEDGER_DATA:
            return Object.assign({}, state, {
                ProviderLedgerList: null,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}