// InitialBalanceConfigurationReducer.js
import {
    // Action Logout
    ACTION_LOGOUT,

    // for get list of initial balance configuration
    GET_INITIAL_BALANCE_CONFIGURATION_LIST,
    GET_INITIAL_BALANCE_CONFIGURATION_LIST_SUCCESS,
    GET_INITIAL_BALANCE_CONFIGURATION_LIST_FAILURE,

    // for Add Initial Balanace 
    ADD_INITIAL_BALANCE_CONFIGURATION,
    ADD_INITIAL_BALANCE_CONFIGURATION_SUCCESS,
    ADD_INITIAL_BALANCE_CONFIGURATION_FAILURE,

    // for clear initial balance configuration
    CLEAR_INITIAL_BALANCE_CONFIGURATION_DATA,

    // Get Arbitrage Provider List
    GET_ARBITRAGE_PROVIDER_LIST,
    GET_ARBITRAGE_PROVIDER_LIST_SUCCESS,
    GET_ARBITRAGE_PROVIDER_LIST_FAILURE,

    // Get Arbitrage Currency List
    GET_ARBITRAGE_CURRENCY_LIST,
    GET_ARBITRAGE_CURRENCY_LIST_SUCCESS,
    GET_ARBITRAGE_CURRENCY_LIST_FAILURE,

} from "../../actions/ActionTypes";

// Initial State 
const INITIAL_STATE = {
    // Initial Balance Configuration List
    InitialBalanceConfigList: null,
    InitialBalanceConfigLoading: false,
    InitialBalanceConfigError: false,

    // for add Initial Balance 
    AddInitialBalanceData: null,
    AddInitialBalanaceLoading: false,

    // for Arbitrage Provider List
    ArbitrageProviderList: null,
    ArbitrageProviderLoading: false,
    ArbitrageProviderError: false,

    // Arbitrage Currency List
    ArbitrageCurrencyList: null,
    ArbitrageCurrencyLoading: false,
    ArbitrageCurrencyError: false,
}

export default function InitialBalanceConfigurationReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Initial Balance Configuration method data
        case GET_INITIAL_BALANCE_CONFIGURATION_LIST:
            return Object.assign({}, state, {
                InitialBalanceConfigList: null,
                InitialBalanceConfigLoading: true
            })
        // Set Initial Balance Configuration success data
        case GET_INITIAL_BALANCE_CONFIGURATION_LIST_SUCCESS:
            return Object.assign({}, state, {
                InitialBalanceConfigList: action.data,
                InitialBalanceConfigLoading: false,
            })
        // Set Initial Balance Configuration failure data
        case GET_INITIAL_BALANCE_CONFIGURATION_LIST_FAILURE:
            return Object.assign({}, state, {
                InitialBalanceConfigList: null,
                InitialBalanceConfigLoading: false,
                InitialBalanceConfigError: true
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
        // handle Add balance add Data
        case ADD_INITIAL_BALANCE_CONFIGURATION:
            return Object.assign({}, state, {
                AddInitialBalanceData: null,
                AddInitialBalanaceLoading: true,
            })
        // set balance Success Data
        case ADD_INITIAL_BALANCE_CONFIGURATION_SUCCESS:
            return Object.assign({}, state, {
                AddInitialBalanceData: action.data,
                AddInitialBalanaceLoading: false,
            })
        // set balance Failure Data
        case ADD_INITIAL_BALANCE_CONFIGURATION_FAILURE:
            return Object.assign({}, state, {
                AddInitialBalanceData: null,
                AddInitialBalanaceLoading: false,
            })

        // Clear Initial Balance Configuration method data
        case CLEAR_INITIAL_BALANCE_CONFIGURATION_DATA:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}