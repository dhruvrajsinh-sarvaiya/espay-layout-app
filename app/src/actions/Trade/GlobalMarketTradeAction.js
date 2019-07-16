import {
    FETCH_MARKET_TRADE_LIST,
    FETCH_MARKET_TRADE_LIST_SUCCESS,
    FETCH_MARKET_TRADE_LIST_FAILURE,
    CLEAR_MARKET_TRADE_LIST,
} from '../ActionTypes';
import { action } from '../GlobalActions';

// Redux Actions for MarketTrade History
export function fetchMarketTradeList(payload) {
    return action(FETCH_MARKET_TRADE_LIST, { payload })
}

// Redux Actions for MarketTrade History Success
export function fetchMarketTradeListSuccess(data) {
    return action(FETCH_MARKET_TRADE_LIST_SUCCESS, { data })
}

// Redux Actions for MarketTrade History Failure
export function fetchMarketTradeListFailure() {
    return action(FETCH_MARKET_TRADE_LIST_FAILURE)
}

// Redux Actions to clear Market Trade List
export function clearMarketTradeList() {
    return action(CLEAR_MARKET_TRADE_LIST)
}
