import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Arbitrage Charge Config List
    GET_ARBI_CHARGE_CONFIG_LIST,
    GET_ARBI_CHARGE_CONFIG_LIST_SUCCESS,
    GET_ARBI_CHARGE_CONFIG_LIST_FAILURE,

    // Clear Arbitrage Config Data
    CLEAR_ARBI_CHARGE_CONFIG_DATA,

    // Add Arbitrage Charge Config Data
    ADD_ARBI_CHARGE_CONFIG_DATA,
    ADD_ARBI_CHARGE_CONFIG_DATA_SUCCESS,
    ADD_ARBI_CHARGE_CONFIG_DATA_FAILURE,

    // Get Arbitrage Currency List
    GET_ARBITRAGE_CURRENCY_LIST,
    GET_ARBITRAGE_CURRENCY_LIST_SUCCESS,
    GET_ARBITRAGE_CURRENCY_LIST_FAILURE,

    // Get Wallet Transaction Type
    GET_WALLET_TRANSACTION_TYPE,
    GET_WALLET_TRANSACTION_TYPE_SUCCESS,
    GET_WALLET_TRANSACTION_TYPE_FAILURE,

    // Get Arbitrage Charge Config Detail List
    GET_ARBI_CHARGE_CONFIG_DETAIL_LIST,
    GET_ARBI_CHARGE_CONFIG_DETAIL_LIST_SUCCESS,
    GET_ARBI_CHARGE_CONFIG_DETAIL_LIST_FAILURE,

    // Update Arbitarge Charge Config Detail
    UPDATE_ARBI_CHARGE_CONFIG_DETAIL_DATA,
    UPDATE_ARBI_CHARGE_CONFIG_DETAIL_DATA_SUCCESS,
    UPDATE_ARBI_CHARGE_CONFIG_DETAIL_DATA_FAILURE,

    // Add Arbitarge Charge Config Detail
    ADD_ARBI_CHARGE_CONFIG_DETAIL_DATA,
    ADD_ARBI_CHARGE_CONFIG_DETAIL_DATA_SUCCESS,
    ADD_ARBI_CHARGE_CONFIG_DETAIL_DATA_FAILURE
} from "../../actions/ActionTypes";

// Initial State for Charge Config
const INITIAL_STATE = {
    // for Arbitrage Charge Config List
    ChargeConfigList: null,
    ChargeConfigLoading: false,
    ChargeConfigError: false,

    // for Add Arbitrage Charge Config
    AddChargeConfigData: null,
    AddChargeConfigLoading: false,
    AddChargeConfigError: false,

    // for Arbitrage Currency List
    ArbitrageCurrencyList: null,
    ArbitrageCurrencyLoading: false,
    ArbitrageCurrencyError: false,

    // for Transaction Type List
    TransactionTypeList: null,
    TransactionTypeLoading: false,
    TransactionTypeError: false,

    // for Arbitrage Charge Config Detail List
    ChargeConfigDetailList: null,
    ChargeConfigDetailLoading: false,
    ChargeConfigDetailError: false,

    // for Update Charge Configuration Detail
    UpdateChargeConfigDetail: null,
    UpdateChargeConfigDetailLoading: false,
    UpdateChargeConfigDetailError: false,

    // for Add Charge Configuration Detail
    AddChargeConfigDetail: null,
    AddChargeConfigDetailLoading: false,
    AddChargeConfigDetailError: false,
}

export default function ArbitrageChargeConfigReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Arbitrage Charge Config List method data
        case GET_ARBI_CHARGE_CONFIG_LIST:
            return Object.assign({}, state, {
                ChargeConfigList: null,
                ChargeConfigLoading: true
            })
        // Set Arbitrage Charge Config List success data
        case GET_ARBI_CHARGE_CONFIG_LIST_SUCCESS:
            return Object.assign({}, state, {
                ChargeConfigList: action.data,
                ChargeConfigLoading: false,
            })
        // Set Arbitrage Charge Config List failure data
        case GET_ARBI_CHARGE_CONFIG_LIST_FAILURE:
            return Object.assign({}, state, {
                ChargeConfigList: null,
                ChargeConfigLoading: false,
                ChargeConfigError: true
            })

        // Clear Arbitrage Charge Config method data
        case CLEAR_ARBI_CHARGE_CONFIG_DATA:
            return Object.assign({}, state, {
                ChargeConfigList: null,
                AddChargeConfigData: null,
                ChargeConfigDetailList: null,
                UpdateChargeConfigDetail: null,
                AddChargeConfigDetail: null,
            })

        // Handle Add Arbitrage Charge Config method data
        case ADD_ARBI_CHARGE_CONFIG_DATA:
            return Object.assign({}, state, {
                AddChargeConfigData: null,
                AddChargeConfigLoading: true
            })
        // Set Add Arbitrage Charge Config success data
        case ADD_ARBI_CHARGE_CONFIG_DATA_SUCCESS:
            return Object.assign({}, state, {
                AddChargeConfigData: action.data,
                AddChargeConfigLoading: false,
            })
        // Set Add Arbitrage Charge Config failure data
        case ADD_ARBI_CHARGE_CONFIG_DATA_FAILURE:
            return Object.assign({}, state, {
                AddChargeConfigData: null,
                AddChargeConfigLoading: false,
                AddChargeConfigError: true
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

        // Handle Transaction Type List method data
        case GET_WALLET_TRANSACTION_TYPE:
            return Object.assign({}, state, {
                TransactionTypeList: null,
                TransactionTypeLoading: true
            })
        // Set Transaction Type List success data
        case GET_WALLET_TRANSACTION_TYPE_SUCCESS:
            return Object.assign({}, state, {
                TransactionTypeList: action.payload,
                TransactionTypeLoading: false,
            })
        // Set Transaction Type List failure data
        case GET_WALLET_TRANSACTION_TYPE_FAILURE:
            return Object.assign({}, state, {
                TransactionTypeList: null,
                TransactionTypeLoading: false,
                TransactionTypeError: true
            })

        // Handle Arbitrage Charge Config Detail List method data
        case GET_ARBI_CHARGE_CONFIG_DETAIL_LIST:
            return Object.assign({}, state, {
                ChargeConfigDetailList: null,
                ChargeConfigDetailLoading: true
            })
        // Set Arbitrage Charge Config Detail List success data
        case GET_ARBI_CHARGE_CONFIG_DETAIL_LIST_SUCCESS:
            return Object.assign({}, state, {
                ChargeConfigDetailList: action.data,
                ChargeConfigDetailLoading: false,
            })
        // Set Arbitrage Charge Config Detail List failure data
        case GET_ARBI_CHARGE_CONFIG_DETAIL_LIST_FAILURE:
            return Object.assign({}, state, {
                ChargeConfigDetailList: null,
                ChargeConfigDetailLoading: false,
                ChargeConfigDetailError: true
            })

        // Handle Update Arbitrage Charge Config Detail method data
        case UPDATE_ARBI_CHARGE_CONFIG_DETAIL_DATA:
            return Object.assign({}, state, {
                UpdateChargeConfigDetail: null,
                UpdateChargeConfigDetailLoading: true
            })
        // Set Update Arbitrage Charge Config Detail success data
        case UPDATE_ARBI_CHARGE_CONFIG_DETAIL_DATA_SUCCESS:
            return Object.assign({}, state, {
                UpdateChargeConfigDetail: action.data,
                UpdateChargeConfigDetailLoading: false,
            })
        // Set Update Arbitrage Charge Config Detail failure data
        case UPDATE_ARBI_CHARGE_CONFIG_DETAIL_DATA_FAILURE:
            return Object.assign({}, state, {
                UpdateChargeConfigDetail: null,
                UpdateChargeConfigDetailLoading: false,
                UpdateChargeConfigDetailError: true
            })

        // Handle Add Arbitrage Charge Config Detail method data
        case ADD_ARBI_CHARGE_CONFIG_DETAIL_DATA:
            return Object.assign({}, state, {
                AddChargeConfigDetail: null,
                AddChargeConfigDetailLoading: true
            })
        // Set Add Arbitrage Charge Config Detail success data
        case ADD_ARBI_CHARGE_CONFIG_DETAIL_DATA_SUCCESS:
            return Object.assign({}, state, {
                AddChargeConfigDetail: action.data,
                AddChargeConfigDetailLoading: false,
            })
        // Set Add Arbitrage Charge Config Detail failure data
        case ADD_ARBI_CHARGE_CONFIG_DETAIL_DATA_FAILURE:
            return Object.assign({}, state, {
                AddChargeConfigDetail: null,
                AddChargeConfigDetailLoading: false,
                AddChargeConfigDetailError: true
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}