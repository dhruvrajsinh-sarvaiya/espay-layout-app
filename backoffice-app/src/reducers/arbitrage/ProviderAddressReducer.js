import {
    // Action Logout
    ACTION_LOGOUT,

    // Clear Provider Address Data
    CLEAR_PROVIDER_ADDRESS_DATA,

    // Get Provider Address List
    GET_PROVIDER_ADDRESS_LIST,
    GET_PROVIDER_ADDRESS_LIST_SUCCESS,
    GET_PROVIDER_ADDRESS_LIST_FAILURE,

    // Add Provider Address
    ADD_PROVIDER_ADDRESS_LIST,
    ADD_PROVIDER_ADDRESS_LIST_SUCCESS,
    ADD_PROVIDER_ADDRESS_LIST_FAILURE,

    // Update Provider Address
    UPDATE_PROVIDER_ADDRESS_LIST,
    UPDATE_PROVIDER_ADDRESS_LIST_SUCCESS,
    UPDATE_PROVIDER_ADDRESS_LIST_FAILURE,

    // Get Arbitrage Provider List
    GET_ARBITRAGE_PROVIDER_LIST,
    GET_ARBITRAGE_PROVIDER_LIST_SUCCESS,
    GET_ARBITRAGE_PROVIDER_LIST_FAILURE,

    // Get Arbitrage Currency List
    GET_ARBITRAGE_CURRENCY_LIST,
    GET_ARBITRAGE_CURRENCY_LIST_SUCCESS,
    GET_ARBITRAGE_CURRENCY_LIST_FAILURE
} from "../../actions/ActionTypes";

// Initial State for Provider Address
const INITIAL_STATE = {
    // for Provider Address List
    ProviderAddressList: null,
    ProviderAddressLoading: false,
    ProviderAddressError: false,

    // for Provider Address Add
    AddProviderAddressLoading: false,
    AddProviderAddressData: null,

    // for Provider Address Update
    UpdateProviderAddressLoading: false,
    UpdateProviderAddressData: null,

    // for Arbitrage Provider List
    ArbitrageProviderList: null,
    ArbitrageProviderLoading: false,
    ArbitrageProviderError: false,

    // Arbitrage Currency List
    ArbitrageCurrencyList: null,
    ArbitrageCurrencyLoading: false,
    ArbitrageCurrencyError: false,
}

export default function ProviderAddressReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Provider Address List method data
        case GET_PROVIDER_ADDRESS_LIST:
            return Object.assign({}, state, {
                ProviderAddressList: null,
                ProviderAddressLoading: true
            })
        // Set Provider Address List success data
        case GET_PROVIDER_ADDRESS_LIST_SUCCESS:
            return Object.assign({}, state, {
                ProviderAddressList: action.payload,
                ProviderAddressLoading: false,
            })
        // Set Provider Address List failure data
        case GET_PROVIDER_ADDRESS_LIST_FAILURE:
            return Object.assign({}, state, {
                ProviderAddressList: null,
                ProviderAddressLoading: false,
                ProviderAddressError: true
            })

        // Clear Provider Address method data
        case CLEAR_PROVIDER_ADDRESS_DATA:
            return INITIAL_STATE

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

        // Handle Arbitrage Provider Add method data
        case ADD_PROVIDER_ADDRESS_LIST:
            return Object.assign({}, state, {
                AddProviderAddressData: null,
                AddProviderAddressLoading: true
            })
        // Set Arbitrage Provider Add success data
        case ADD_PROVIDER_ADDRESS_LIST_SUCCESS:
            return Object.assign({}, state, {
                AddProviderAddressData: action.data,
                AddProviderAddressLoading: false,
            })
        // Set Arbitrage Provider Add failure data
        case ADD_PROVIDER_ADDRESS_LIST_FAILURE:
            return Object.assign({}, state, {
                AddProviderAddressData: null,
                AddProviderAddressLoading: false,
            })

        // Handle Arbitrage Provider Update method data
        case UPDATE_PROVIDER_ADDRESS_LIST:
            return Object.assign({}, state, {
                UpdateProviderAddressData: null,
                UpdateProviderAddressLoading: true
            })
        // Set Arbitrage Provider Update success data
        case UPDATE_PROVIDER_ADDRESS_LIST_SUCCESS:
            return Object.assign({}, state, {
                UpdateProviderAddressData: action.data,
                UpdateProviderAddressLoading: false,
            })
        // Set Arbitrage Provider Update failure data
        case UPDATE_PROVIDER_ADDRESS_LIST_FAILURE:
            return Object.assign({}, state, {
                UpdateProviderAddressData: null,
                UpdateProviderAddressLoading: false,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}