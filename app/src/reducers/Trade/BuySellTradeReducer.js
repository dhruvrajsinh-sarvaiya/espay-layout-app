// Action types for BuySell Trade
import {
    // Buy Sell Trade
    BUY_SELL_TRADE,
    BUY_SELL_TRADE_SUCCESS,
    BUY_SELL_TRADE_FAILURE,

    // Clear Buy Sell Trade
    CLEAR_BUY_SELL_TRADE,

    // Action Logout
    ACTION_LOGOUT
} from '../../actions/ActionTypes';

// Initial state for BuySell Trade
const INTIAL_STATE = {

    //Buy | Sell Trades
    buySellTrade: null,
    isBuySell: false,
    buySellError: false,
}

export default function buySellTradeReducer(state = INTIAL_STATE, action) {

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // To reset initial state on clear method
        case CLEAR_BUY_SELL_TRADE: {
            return INTIAL_STATE;
        }

        // Handle BuySell Trade method data
        case BUY_SELL_TRADE: {
            return Object.assign({}, state, {
                isBuySell: true,
                buySellTrade: null,
                buySellError: false
            })
        }
        // Set BuySell Trade success data
        case BUY_SELL_TRADE_SUCCESS: {
            return Object.assign({}, state, {
                isBuySell: false,
                buySellTrade: action.data,
                buySellError: false
            })
        }
        // Set BuySell Trade failure data
        case BUY_SELL_TRADE_FAILURE: {
            return Object.assign({}, state, {
                isBuySell: false,
                buySellTrade: null,
                buySellError: true
            })
        }

        // If no actions were found from reducer then return default [existing] state value
        default: return state;
    }
}