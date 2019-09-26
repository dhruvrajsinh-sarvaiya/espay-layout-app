// ArbitrageManageMarketReducer.js
import {
    // Action Logout
    ACTION_LOGOUT,

    // for get List of Manage Market
    GET_ARBITRAGE_MANAGE_MARKET_LIST,
    GET_ARBITRAGE_MANAGE_MARKET_LIST_SUCCESS,
    GET_ARBITRAGE_MANAGE_MARKET_LIST_FAILURE,

    // for update Manage Market Status 
    UPDATE_ARBITRAGE_MANAGE_MARKET_STATUS,
    UPDATE_ARBITRAGE_MANAGE_MARKET_STATUS_SUCCESS,
    UPDATE_ARBITRAGE_MANAGE_MARKET_STATUS_FAILURE,

    // for Currency List Arbitrage
    GET_CURRENCY_LIST_ARBITRAGE,
    GET_CURRENCY_LIST_ARBITRAGE_SUCCESS,
    GET_CURRENCY_LIST_ARBITRAGE_FAILURE,

    // for Add Manage Market Currency
    ADD_ARBITRAGE_MANAGE_MARKET,
    ADD_ARBITRAGE_MANAGE_MARKET_SUCCESS,
    ADD_ARBITRAGE_MANAGE_MARKET_FAILURE,

    // for clear Manage Market Data
    CLEAR_ARBITRAGE_MANAGE_MARKET_DATA
} from "../../actions/ActionTypes";

// Initial State for Manage Market
const INITIAL_STATE = {
    // List of Manage Market
    ArbiManageMarketList: null,
    ArbiManageMarketLoading: false,
    ArbiManageMarketError: false,

    // update Status of Manage Market
    updatedArbiManageMarketList: null,
    updatedArbiManageMarketLoading: false,

    // for List currency Arbitrage
    ArbitrageCurrencyList: null,
    ArbitrageCurrencyListLoading: false,

    // for Add Manage Market Data
    AddArbiManageMarketListData: null,
    AddArbiManageMarketLoading: false
}

export default function ArbitrageManageMarketReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Manage Market method data
        case GET_ARBITRAGE_MANAGE_MARKET_LIST:
            return Object.assign({}, state, {
                AddArbiManageMarketListData: null,
                ArbiManageMarketLoading: true
            })
        // Set Manage Market success data
        case GET_ARBITRAGE_MANAGE_MARKET_LIST_SUCCESS:
            return Object.assign({}, state, {
                AddArbiManageMarketListData: action.data,
                ArbiManageMarketLoading: false,
            })
        // Set Manage Market failure data
        case GET_ARBITRAGE_MANAGE_MARKET_LIST_FAILURE:
            return Object.assign({}, state, {
                AddArbiManageMarketListData: null,
                ArbiManageMarketLoading: false,
                ArbiManageMarketError: true
            })

        // Handle update Manage Market method data
        case UPDATE_ARBITRAGE_MANAGE_MARKET_STATUS:
            return Object.assign({}, state, {
                updatedArbiManageMarketList: null,
                updatedArbiManageMarketLoading: true
            })
        // Set Update Manage Market success data
        case UPDATE_ARBITRAGE_MANAGE_MARKET_STATUS_SUCCESS:
            return Object.assign({}, state, {
                updatedArbiManageMarketList: action.data,
                updatedArbiManageMarketLoading: false,
            })
        // Set Update Manage Market failure data
        case UPDATE_ARBITRAGE_MANAGE_MARKET_STATUS_FAILURE:
            return Object.assign({}, state, {
                updatedArbiManageMarketList: null,
                updatedArbiManageMarketLoading: false,
            })

        // Handle List Currency method data
        case GET_CURRENCY_LIST_ARBITRAGE:
            return Object.assign({}, state, {
                ArbitrageCurrencyList: null,
                ArbitrageCurrencyListLoading: true
            })
        // Set List Currency success data
        case GET_CURRENCY_LIST_ARBITRAGE_SUCCESS:
            return Object.assign({}, state, {
                ArbitrageCurrencyList: action.data,
                ArbitrageCurrencyListLoading: false,
            })
        // Set List Currency failure data
        case GET_CURRENCY_LIST_ARBITRAGE_FAILURE:
            return Object.assign({}, state, {
                ArbitrageCurrencyList: null,
                ArbitrageCurrencyListLoading: false,
            })

        // Handle update Manage Market method data
        case ADD_ARBITRAGE_MANAGE_MARKET:
            return Object.assign({}, state, {
                AddArbiManageMarketList: null,
                AddArbiManageMarketLoading: true
            })
        // Set Update Manage Market success data
        case ADD_ARBITRAGE_MANAGE_MARKET_SUCCESS:
            return Object.assign({}, state, {
                AddArbiManageMarketList: action.data,
                AddArbiManageMarketLoading: false,
            })
        // Set Update Manage Market failure data
        case ADD_ARBITRAGE_MANAGE_MARKET_FAILURE:
            return Object.assign({}, state, {
                AddArbiManageMarketList: null,
                AddArbiManageMarketLoading: false,
            })

        // Clear Manage Market method data
        case CLEAR_ARBITRAGE_MANAGE_MARKET_DATA:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}