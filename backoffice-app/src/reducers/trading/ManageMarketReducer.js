// ManageMarketReducer
import {
    // Get Manage Market List
    GET_MANAGE_MARKET_LIST,
    GET_MANAGE_MARKET_LIST_SUCCESS,
    GET_MANAGE_MARKET_LIST_FAILURE,

    // Add Manage Market List
    ADD_MANAGE_MARKET_LIST,
    ADD_MANAGE_MARKET_LIST_SUCCESS,
    ADD_MANAGE_MARKET_LIST_FAILURE,
    ADD_MANAGE_MARKET_LIST_CLEAR,

    // Update Manage Market List
    UPDATE_MANAGE_MARKET_LIST,
    UPDATE_MANAGE_MARKET_LIST_SUCCESS,
    UPDATE_MANAGE_MARKET_LIST_FAILURE,
    UPDATE_MANAGE_MARKET_LIST_CLEAR,

    // Get Trading Currency List
    GET_TRADING_CURRENCY_LIST,
    GET_TRADING_CURRENCY_LIST_SUCCESS,
    GET_TRADING_CURRENCY_LIST_FAILURE,

    // Clear All Trading Market Data
    CLEAR_ALL_TRADING_MARKET_DATA,

    // Action Logout
    ACTION_LOGOUT

} from '../../actions/ActionTypes'

const initialState = {
    // for get list of marketlist
    isMarketlistFetch: false,
    MarketlistDataget: null,
    MarketlistdataFetch: true,

    // for add data in marketlist
    isAddMarketlist: false,
    AddMarketlistdata: null,
    AddedMarketlistdata: true,

    // for edit marketlist
    isEditMarketlist: false,
    EditMarketlistdata: null,
    EditedMarketlistdata: true,

    // for currecny List
    isCurrecnyFetch: false,
    currencyList: null,
    currecnyListFetch: true,
}

export default function manageMarketReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return initialState
        }

        // Clear all trading market data
        case CLEAR_ALL_TRADING_MARKET_DATA: {
            return initialState
        }

        // Handle Get Manage Market List method data
        case GET_MANAGE_MARKET_LIST:
            return Object.assign({}, state, {
                isMarketlistFetch: true,
                MarketlistDataget: null,
                MarketlistdataFetch: true,
                EditedMarketlistdata: true,
            })
        // Set Manage Market List success data
        case GET_MANAGE_MARKET_LIST_SUCCESS:
            return Object.assign({}, state, {
                isMarketlistFetch: false,
                MarketlistDataget: action.data,
                MarketlistdataFetch: false,
                EditedMarketlistdata: true,
            })
        // Set Manage Market List failure data
        case GET_MANAGE_MARKET_LIST_FAILURE:
            return Object.assign({}, state, {
                isMarketlistFetch: false,
                MarketlistDataget: null,
                MarketlistdataFetch: false,
                EditedMarketlistdata: true,
            })

        // Handle Trading Currency List method data
        case GET_TRADING_CURRENCY_LIST:
            return Object.assign({}, state, {
                isCurrecnyFetch: true,
                currencyList: null,
                currecnyListFetch: true,
                AddedMarketlistdata: true,
            })
        // Set Trading Currency List success data
        case GET_TRADING_CURRENCY_LIST_SUCCESS:
            return Object.assign({}, state, {
                isCurrecnyFetch: false,
                currencyList: action.data,
                currecnyListFetch: false,
                AddedMarketlistdata: true,
            })
        // Set Trading Currency List failure data
        case GET_TRADING_CURRENCY_LIST_FAILURE:
            return Object.assign({}, state, {
                isCurrecnyFetch: false,
                currencyList: null,
                currecnyListFetch: false,
                AddedMarketlistdata: true,
            })

        // Handle Add Manage Market List method data
        case ADD_MANAGE_MARKET_LIST:
            return Object.assign({}, state, {
                isAddMarketlist: true,
                AddMarketlistdata: null,
                AddedMarketlistdata: true,
                currecnyListFetch: true,
            })
        // Add Manage Market List success data
        case ADD_MANAGE_MARKET_LIST_SUCCESS:
            return Object.assign({}, state, {
                isAddMarketlist: false,
                AddMarketlistdata: action.data,
                AddedMarketlistdata: false,
                currecnyListFetch: true,
            })
        // Add Manage Market List failure data
        case ADD_MANAGE_MARKET_LIST_FAILURE:
            return Object.assign({}, state, {
                isAddMarketlist: false,
                AddMarketlistdata: null,
                AddedMarketlistdata: false,
                currecnyListFetch: true,
            })
        // Clear data
        case ADD_MANAGE_MARKET_LIST_CLEAR:
            return Object.assign({}, state, {
                isAddMarketlist: false,
                AddMarketlistdata: null,
                AddedMarketlistdata: true,
                currecnyListFetch: true,
            })

        // Handle Update Manage Market List method data
        case UPDATE_MANAGE_MARKET_LIST:
            return Object.assign({}, state, {
                isEditMarketlist: true,
                EditMarketlistdata: null,
                EditedMarketlistdata: true,
                MarketlistdataFetch: true,
            })
        // Update Manage Market List success data
        case UPDATE_MANAGE_MARKET_LIST_SUCCESS:
            return Object.assign({}, state, {
                isEditMarketlist: false,
                EditMarketlistdata: action.data,
                EditedMarketlistdata: false,
                MarketlistdataFetch: true,
            })
        // Update Manage Market List failure data
        case UPDATE_MANAGE_MARKET_LIST_FAILURE:
            return Object.assign({}, state, {
                isEditMarketlist: false,
                EditMarketlistdata: null,
                EditedMarketlistdata: false,
                MarketlistdataFetch: true,
            })
        // for clear
        case UPDATE_MANAGE_MARKET_LIST_CLEAR:
            return Object.assign({}, state, {
                isEditMarketlist: false,
                EditMarketlistdata: null,
                EditedMarketlistdata: true,
                MarketlistdataFetch: true,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}