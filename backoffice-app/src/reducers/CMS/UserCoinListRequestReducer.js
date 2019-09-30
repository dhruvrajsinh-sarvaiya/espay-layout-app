// UserCoinListRequestReducer.js
import {
    // when user logout than clear reducer data
    ACTION_LOGOUT,

    // User Coin List Request
    GET_USER_COIN_LIST_REQUEST,
    GET_USER_COIN_LIST_REQUEST_SUCCESS,
    GET_USER_COIN_LIST_REQUEST_FAILURE,

    // Clear User Coin List Request
    CLEAR_USER_COIN_LIST_REQUEST,

    // Get Coin List Request Dashboard Count
    GET_COIN_LIST_REQ_DASHBOARD_COUNT,
    GET_COIN_LIST_REQ_DASHBOARD_COUNT_SUCCESS,
    GET_COIN_LIST_REQ_DASHBOARD_COUNT_FAILURE
} from '../../actions/ActionTypes';

// Initial State for User Coin List Request
const INITIAL_STATE = {
    // User Coin List Request
    UserCoinListRequest: null,
    UserCoinListRequestLoading: false,
    UserCoinListRequestError: false,

    // Coin List Dashboard Count
    CoinListDashCount: null,
    CoinListDashCountLoading: false,
    CoinListDashCountError: false,
}

export default function UserCoinListRequestReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle User Coin List Request method data
        case GET_USER_COIN_LIST_REQUEST:
            return Object.assign({}, state, {
                UserCoinListRequest: null,
                UserCoinListRequestLoading: true
            })
        // Set User Coin List Request success data
        case GET_USER_COIN_LIST_REQUEST_SUCCESS:
            return Object.assign({}, state, {
                UserCoinListRequest: action.data,
                UserCoinListRequestLoading: false,
            })
        // Set User Coin List Request failure data
        case GET_USER_COIN_LIST_REQUEST_FAILURE:
            return Object.assign({}, state, {
                UserCoinListRequest: null,
                UserCoinListRequestLoading: false,
                UserCoinListRequestError: true
            })

        // Handle Coin List Request Dashboard Count method data
        case GET_COIN_LIST_REQ_DASHBOARD_COUNT:
            return Object.assign({}, state, {
                CoinListDashCount: null,
                CoinListDashCountLoading: true
            })
        // Set Coin List Request Dashboard Count success data
        case GET_COIN_LIST_REQ_DASHBOARD_COUNT_SUCCESS:
            return Object.assign({}, state, {
                CoinListDashCount: action.data,
                CoinListDashCountLoading: false,
            })
        // Set Coin List Request Dashboard Count failure data
        case GET_COIN_LIST_REQ_DASHBOARD_COUNT_FAILURE:
            return Object.assign({}, state, {
                CoinListDashCount: null,
                CoinListDashCountLoading: false,
                CoinListDashCountError: true
            })

        // Clear User Coin List Request method data
        case CLEAR_USER_COIN_LIST_REQUEST:
            return Object.assign({}, state, {
                UserCoinListRequest: null,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}