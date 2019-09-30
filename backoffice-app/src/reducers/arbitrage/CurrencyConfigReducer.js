import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Arbitrage Currency Config List
    GET_ARBI_CURRENCY_CONFIG_LIST,
    GET_ARBI_CURRENCY_CONFIG_LIST_SUCCESS,
    GET_ARBI_CURRENCY_CONFIG_LIST_FAILURE,

    // Clear Arbi Currency Config Data
    CLEAR_ARBI_CURRENCY_CONFIG_DATA
} from "../../actions/ActionTypes";

// Initial State for Currency Config
const INITIAL_STATE = {
    // Currency Configuration
    CurrencyConfigList: null,
    CurrencyConfigLoading: false,
    CurrencyConfigError: false,
}

export default function CurrencyConfigReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Currency Config method data
        case GET_ARBI_CURRENCY_CONFIG_LIST:
            return Object.assign({}, state, {
                CurrencyConfigList: null,
                CurrencyConfigLoading: true
            })
        // Set Currency Config success data
        case GET_ARBI_CURRENCY_CONFIG_LIST_SUCCESS:
            return Object.assign({}, state, {
                CurrencyConfigList: action.data,
                CurrencyConfigLoading: false,
            })
        // Set Currency Config failure data
        case GET_ARBI_CURRENCY_CONFIG_LIST_FAILURE:
            return Object.assign({}, state, {
                CurrencyConfigList: null,
                CurrencyConfigLoading: false,
                CurrencyConfigError: true
            })

        // Clear Currency Config method data
        case CLEAR_ARBI_CURRENCY_CONFIG_DATA:
            return Object.assign({}, state, {
                CurrencyConfigList: null,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}