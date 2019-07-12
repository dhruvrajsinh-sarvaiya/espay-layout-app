import {
    // Fetch Market List
    FETCH_MARKET_LIST,
    FETCH_MARKET_LIST_SUCCESS,
    FETCH_MARKET_LIST_FAILURE,

    // Store Base Currency
    STORE_BASE_CURRENCY,

    // Refresh Market List
    REFRESH_MARKET_LIST,

    // Clear Market List
    CLEAR_MARKET_LIST,

    // Fetch Margin Market List
    FETCH_MARGIN_MARKET_LIST_SUCCESS,
    FETCH_MARGIN_MARKET_LIST_FAILURE,
} from '../ActionTypes';

import { action } from '../GlobalActions';

//For Fetch Market List aka Pair List, Method : GetTradePairAsset
export function onFetchMarkets(payload) { return action(FETCH_MARKET_LIST, { payload: payload !== undefined ? payload : {} }) }

// Redux action for Market Success
export function onMarketSuccess(data) { return action(FETCH_MARKET_LIST_SUCCESS, { payload: data }) }

// Redux action for Market Failure
export function onMarketFailure() { return action(FETCH_MARKET_LIST_FAILURE) }

// Clear Market List
export function clearMarketList() { return action(CLEAR_MARKET_LIST) }

//to refresh market list
export function refreshMarkets(payload) { return action(REFRESH_MARKET_LIST, { payload }); }

//To store base currency for fetching volume list
export function storeBaseCurrency(baseCurrency) { return action(STORE_BASE_CURRENCY, { payload: baseCurrency }); }

// For fetch margin market list and pair list data
export function onFetchMarginMarkets(payload) { return action(FETCH_MARKET_LIST, { payload: payload }) }

// Redux action for Margin Market Success
export function onMarginMarketSuccess(data) { return action(FETCH_MARGIN_MARKET_LIST_SUCCESS, { payload: data }) }

// Redux action for Margin Market Failure
export function onMarginMarketFailure() { return action(FETCH_MARGIN_MARKET_LIST_FAILURE) }