// MarginManageMarketReducer
import {
    // Get Margin Manage Market List
    GET_MARGIN_MANAGE_MARKET_LIST,
    GET_MARGIN_MANAGE_MARKET_LIST_SUCCESS,
    GET_MARGIN_MANAGE_MARKET_LIST_FAILURE,

    // Add Margin Manage Market List
    ADD_MARGIN_MANAGE_MARKET_LIST,
    ADD_MARGIN_MANAGE_MARKET_LIST_SUCCESS,
    ADD_MARGIN_MANAGE_MARKET_LIST_FAILURE,

    // Clear Add Margin Manage Market List
    ADD_MARGIN_MANAGE_MARKET_LIST_CLEAR,

    // Update Margin Manage Market List
    UPDATE_MARGIN_MANAGE_MARKET_LIST,
    UPDATE_MARGIN_MANAGE_MARKET_LIST_SUCCESS,
    UPDATE_MARGIN_MANAGE_MARKET_LIST_FAILURE,

    // Clear Update Margin Manage Market List
    UPDATE_MARGIN_MANAGE_MARKET_LIST_CLEAR,

    // Get Margin Currency List
    GET_MARGIN_CURRENCY_LIST,
    GET_MARGIN_CURRENCY_LIST_SUCCESS,
    GET_MARGIN_CURRENCY_LIST_FAILURE,

    // Clear All Margin Market Data
    CLEAR_ALL_MARGIN_MARKET_DATA,

    // Action Logout
    ACTION_LOGOUT

} from '../../actions/ActionTypes'

const INITIAL_STATE = {
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

export default function MarginManageMarketReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE
        }

        // Clear Margin Market Data
        case CLEAR_ALL_MARGIN_MARKET_DATA: {
            return INITIAL_STATE
        }

        // Handle Get Margin Manage Market List method data
        case GET_MARGIN_MANAGE_MARKET_LIST:
            return Object.assign({}, state, {
                isMarketlistFetch: true,
                MarketlistDataget: null,
                MarketlistdataFetch: true,
                EditedMarketlistdata: true,
            })
        // Set Margin Manage Market List success data
        case GET_MARGIN_MANAGE_MARKET_LIST_SUCCESS:
            return Object.assign({}, state, {
                isMarketlistFetch: false,
                MarketlistDataget: action.data,
                MarketlistdataFetch: false,
                EditedMarketlistdata: true,
            })
        // Set Margin Manage Market List failure data
        case GET_MARGIN_MANAGE_MARKET_LIST_FAILURE:
            return Object.assign({}, state, {
                isMarketlistFetch: false,
                MarketlistDataget: null,
                MarketlistdataFetch: false,
                EditedMarketlistdata: true,
            })

        // Handle Get Margin Currency List method data
        case GET_MARGIN_CURRENCY_LIST:
            return Object.assign({}, state, {
                isCurrecnyFetch: true,
                currencyList: null,
                currecnyListFetch: true,
                AddedMarketlistdata: true,
            })
        // Set Margin Currnecy List success data
        case GET_MARGIN_CURRENCY_LIST_SUCCESS:
            return Object.assign({}, state, {
                isCurrecnyFetch: false,
                currencyList: action.data,
                currecnyListFetch: false,
                AddedMarketlistdata: true,
            })
        // Set Margin Currnecy List failure data
        case GET_MARGIN_CURRENCY_LIST_FAILURE:
            return Object.assign({}, state, {
                isCurrecnyFetch: false,
                currencyList: null,
                currecnyListFetch: false,
                AddedMarketlistdata: true,
            })

        // Handle Add Margin Manage Market List method data
        case ADD_MARGIN_MANAGE_MARKET_LIST:
            return Object.assign({}, state, {
                isAddMarketlist: true,
                AddMarketlistdata: null,
                AddedMarketlistdata: true,
                currecnyListFetch: true,
            })
        // Set 'Add Margin Manage Market List' success data
        case ADD_MARGIN_MANAGE_MARKET_LIST_SUCCESS:
            return Object.assign({}, state, {
                isAddMarketlist: false,
                AddMarketlistdata: action.data,
                AddedMarketlistdata: false,
                currecnyListFetch: true,
            })
        // Set 'Add Margin Manage Market List' failure data
        case ADD_MARGIN_MANAGE_MARKET_LIST_FAILURE:
            return Object.assign({}, state, {
                isAddMarketlist: false,
                AddMarketlistdata: null,
                AddedMarketlistdata: false,
                currecnyListFetch: true,
            })
        // Clear Margin Manage Market List method data
        case ADD_MARGIN_MANAGE_MARKET_LIST_CLEAR:
            return Object.assign({}, state, {
                isAddMarketlist: false,
                AddMarketlistdata: null,
                AddedMarketlistdata: true,
                currecnyListFetch: true,
            })

        // Handle Update Margin Manage Market List method data
        case UPDATE_MARGIN_MANAGE_MARKET_LIST:
            return Object.assign({}, state, {
                isEditMarketlist: true,
                EditMarketlistdata: null,
                EditedMarketlistdata: true,
                MarketlistdataFetch: true,
            })
        // Set 'Update Margin Manage Market List' success data
        case UPDATE_MARGIN_MANAGE_MARKET_LIST_SUCCESS:
            return Object.assign({}, state, {
                isEditMarketlist: false,
                EditMarketlistdata: action.data,
                EditedMarketlistdata: false,
                MarketlistdataFetch: true,
            })
        // Set 'Update Margin Manage Market List' failure data
        case UPDATE_MARGIN_MANAGE_MARKET_LIST_FAILURE:
            return Object.assign({}, state, {
                isEditMarketlist: false,
                EditMarketlistdata: null,
                EditedMarketlistdata: false,
                MarketlistdataFetch: true,
            })
        // Clear Update Margin Manage Market List method data
        case UPDATE_MARGIN_MANAGE_MARKET_LIST_CLEAR:
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