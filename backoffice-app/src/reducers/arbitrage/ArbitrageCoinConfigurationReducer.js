// ArbitrageCoinConfigurationReducer.js
import {
    // Action Logout
    ACTION_LOGOUT,

    // for arbitrage coin configuration List
    GET_ARBITRAGE_COIN_CONFIGURATION_LIST,
    GET_ARBITRAGE_COIN_CONFIGURATION_LIST_SUCCESS,
    GET_ARBITRAGE_COIN_CONFIGURATION_LIST_FAILURE,

    // for Add Arbitrage coin configuration
    ADD_ARBITRAGE_COIN_CONFIGURATION_DATA,
    ADD_ARBITRAGE_COIN_CONFIGURATION_DATA_SUCCESS,
    ADD_ARBITRAGE_COIN_CONFIGURATION_DATA_FAILURE,

    // for Update Arbitrage Coin Configuration
    UPDATE_ARBITRAGE_COIN_CONFIGURATION_DATA,
    UPDATE_ARBITRAGE_COIN_CONFIGURATION_DATA_SUCCESS,
    UPDATE_ARBITRAGE_COIN_CONFIGURATION_DATA_FAILURE,

    //Add Currecny Logo
    ADD_CURRENCY_LOGO,
    ADD_CURRENCY_LOGO_SUCCESS,
    ADD_CURRENCY_LOGO_FAILURE,

    // for clear coin configuration data
    CLEAR_ARBITRAGE_COIN_CONFIGURATION_DATA
} from "../../actions/ActionTypes";

// Initial State for coin configuration
const INITIAL_STATE = {
    // coin Configuration
    ArbiCoinConfigList: null,
    ArbiCoinConfigLoading: false,
    ArbiCoinConfigError: false,

    // Add Coin Configuration
    AddArbiCoinConfigList: null,
    AddArbiCoinConfigLoading: false,

    // update Coin Configuration
    UpdateArbiCoinConfigList: null,
    UpdateArbiCoinConfigLoading: false,

    //Initial State For Add Currency Logo
    isLoadinCurrencyLogo: false,
    AddCurrencyLogodata: null,
}

export default function ArbitrageCoinConfigurationReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle coin configuration method data
        case GET_ARBITRAGE_COIN_CONFIGURATION_LIST:
            return Object.assign({}, state, {
                ArbiCoinConfigList: null,
                ArbiCoinConfigLoading: true
            })
        // Set coin configuration success data
        case GET_ARBITRAGE_COIN_CONFIGURATION_LIST_SUCCESS:
            return Object.assign({}, state, {
                ArbiCoinConfigList: action.data,
                ArbiCoinConfigLoading: false,
            })
        // Set coin configuration failure data
        case GET_ARBITRAGE_COIN_CONFIGURATION_LIST_FAILURE:
            return Object.assign({}, state, {
                ArbiCoinConfigList: null,
                ArbiCoinConfigLoading: false,
                ArbiCoinConfigError: true
            })
        // Handle Add coin configuration method data
        case ADD_ARBITRAGE_COIN_CONFIGURATION_DATA:
            return Object.assign({}, state, {
                AddArbiCoinConfigList: null,
                AddArbiCoinConfigLoading: true
            })
        // Set Add coin configuration success data
        case ADD_ARBITRAGE_COIN_CONFIGURATION_DATA_SUCCESS:
            return Object.assign({}, state, {
                AddArbiCoinConfigList: action.data,
                AddArbiCoinConfigLoading: false,
            })
        // Set Add coin configuration failure data
        case ADD_ARBITRAGE_COIN_CONFIGURATION_DATA_FAILURE:
            return Object.assign({}, state, {
                AddArbiCoinConfigList: null,
                AddArbiCoinConfigLoading: false,
            })
        // Handle Update coin configuration method data
        case UPDATE_ARBITRAGE_COIN_CONFIGURATION_DATA:
            return Object.assign({}, state, {
                UpdateArbiCoinConfigList: null,
                UpdateArbiCoinConfigLoading: true
            })
        // Set Update coin configuration success data
        case UPDATE_ARBITRAGE_COIN_CONFIGURATION_DATA_SUCCESS:
            return Object.assign({}, state, {
                UpdateArbiCoinConfigList: action.data,
                UpdateArbiCoinConfigLoading: false,
            })
        // Set Add coin configuration failure data
        case UPDATE_ARBITRAGE_COIN_CONFIGURATION_DATA_FAILURE:
            return Object.assign({}, state, {
                UpdateArbiCoinConfigList: null,
                UpdateArbiCoinConfigLoading: false,
            })
        //For Add Currency Logo
        case ADD_CURRENCY_LOGO:
            return Object.assign({}, state, {
                isLoadinCurrencyLogo: true,
                AddCurrencyLogodata: null
            })

        case ADD_CURRENCY_LOGO_SUCCESS:
        case ADD_CURRENCY_LOGO_FAILURE:
            return Object.assign({}, state, {
                isLoadinCurrencyLogo: false,
                AddCurrencyLogodata: action.payload
            })

        // Clear coin configuration method data
        case CLEAR_ARBITRAGE_COIN_CONFIGURATION_DATA:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}