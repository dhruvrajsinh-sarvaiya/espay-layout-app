import {
    // Action Logout
    ACTION_LOGOUT,

    //Get Arbitrage User Count
    GET_ARBITRAGE_USER_TRADE_COUNT,
    GET_ARBITRAGE_USER_TRADE_COUNT_SUCCESS,
    GET_ARBITRAGE_USER_TRADE_COUNT_FAILURE,

    //Get Arbitrage User Market Count
    GET_USER_MARKET_COUNT,
    GET_USER_MARKET_COUNT_SUCCESS,
    GET_USER_MARKET_COUNT_FAILURE,

} from "../../actions/ActionTypes";

// Initial State for Get Arbitrage User Count
const INITIAL_STATE = {

    // for Arbitrage User Count
    ArbitrageUserCountdata: null,
    ArbitrageUserCountIsFetching: false,
    ArbitrageUserCountError: false,

    // for Arbitrage User Market Count
    ArbitrageMarketTypeUserCountdata: null,
    ArbitrageMarketTypeUserCountIsFetching: false,
    ArbitrageMarketTypeUserCountError: false,
}

export default function ArbitrageUserTradeReducer(state, action) {
    
    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Arbitrage User Count method data
        case GET_ARBITRAGE_USER_TRADE_COUNT:
            return Object.assign({}, state, {
                ArbitrageUserCountdata: null,
                ArbitrageUserCountIsFetching: true,
            })

        // Set Arbitrage User Count success data
        case GET_ARBITRAGE_USER_TRADE_COUNT_SUCCESS:
            return Object.assign({}, state, {
                ArbitrageUserCountdata: action.payload,
                ArbitrageUserCountIsFetching: false,
            })

        // Set Arbitrage User Count Failue data
        case GET_ARBITRAGE_USER_TRADE_COUNT_FAILURE:
            return Object.assign({}, state, {
                ArbitrageUserCountdata: null,
                ArbitrageUserCountIsFetching: false,
                ArbitrageUserCountError: true,
            })

        // Handle Arbitrage Market Type User Count method data
        case GET_USER_MARKET_COUNT:
            return Object.assign({}, state, {
                ArbitrageMarketTypeUserCountdata: null,
                ArbitrageMarketTypeUserCountIsFetching: true,
            })

        // Set Arbitrage Market Type User Count success data
        case GET_USER_MARKET_COUNT_SUCCESS:
            return Object.assign({}, state, {
                ArbitrageMarketTypeUserCountdata: action.payload,
                ArbitrageMarketTypeUserCountIsFetching: false,
            })

        // Set Arbitrage Market Type User Count Failue data
        case GET_USER_MARKET_COUNT_FAILURE:
            return Object.assign({}, state, {
                ArbitrageMarketTypeUserCountdata: null,
                ArbitrageMarketTypeUserCountIsFetching: false,
                ArbitrageMarketTypeUserCountError: true,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}