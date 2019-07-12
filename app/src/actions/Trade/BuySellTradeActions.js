import {
    // Buy Sell Trade
    BUY_SELL_TRADE,
    BUY_SELL_TRADE_SUCCESS,
    BUY_SELL_TRADE_FAILURE,
    CLEAR_BUY_SELL_TRADE,
} from '../ActionTypes';

import { action } from '../GlobalActions';

//For Buy and Sell Trades : Method : CreateTransactionOrder
export function onBuySellTrade(payload) { return action(BUY_SELL_TRADE, { payload }); }

// Redux action for Buy Sell Trade Success
export function onBuySellTradeSuccess(data) { return action(BUY_SELL_TRADE_SUCCESS, { data }); }

// Redux action for Buy Sell Trade Failure
export function onBuySellTradeFailure() { return action(BUY_SELL_TRADE_FAILURE); }

// Redux action to Clear Buy Sell Trade
export function clearBuySellTrade() { return action(CLEAR_BUY_SELL_TRADE); }