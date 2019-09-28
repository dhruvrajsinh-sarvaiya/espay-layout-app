// ArbitrageManageMarketActions.js
import {
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
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Manage Market
export function getArbiManageMarketList() {
    return action(GET_ARBITRAGE_MANAGE_MARKET_LIST)
}

// Redux action for Get Manage Market Success
export function getArbiManageMarketListSuccess(data) {
    return action(GET_ARBITRAGE_MANAGE_MARKET_LIST_SUCCESS, { data })
}

// Redux action for Get Manage Market Failure
export function getArbiManageMarketListFailure() {
    return action(GET_ARBITRAGE_MANAGE_MARKET_LIST_FAILURE)
}

// Redux action for Update Manage Market
export function updateArbiManageMarketList(payload = {}) {
    return action(UPDATE_ARBITRAGE_MANAGE_MARKET_STATUS, { payload })
}
// Redux action for Update Manage Market success
export function updateArbiManageMarketListSuccess(data) {
    return action(UPDATE_ARBITRAGE_MANAGE_MARKET_STATUS_SUCCESS, { data })
}
// Redux action for Update Manage Market failure
export function updateArbiManageMarketListFailure() {
    return action(UPDATE_ARBITRAGE_MANAGE_MARKET_STATUS_FAILURE)
}

// Redux action for get list of Manage Market Currency
export function getListCurrencyArbitrage(payload = {}) {
    return action(GET_CURRENCY_LIST_ARBITRAGE, { payload })
}
// Redux action for get list of Manage Market Currency success
export function getListCurrencyArbitrageSuccess(data) {
    return action(GET_CURRENCY_LIST_ARBITRAGE_SUCCESS, { data })
}
// Redux action for get list of Manage Market Currency failure
export function getListCurrencyArbitrageFailure() {
    return action(GET_CURRENCY_LIST_ARBITRAGE_FAILURE)
}

// Redux action for Add Manage Market
export function AddArbiManageMarketList(payload = {}) {
    return action(ADD_ARBITRAGE_MANAGE_MARKET, { payload })
}
// Redux action for Add Manage Market success
export function addArbiManageMarketListSuccess(data) {
    return action(ADD_ARBITRAGE_MANAGE_MARKET_SUCCESS, { data })
}
// Redux action for Add Manage Market failure
export function addArbiManageMarketListFailure() {
    return action(ADD_ARBITRAGE_MANAGE_MARKET_FAILURE)
}

// Redux action for Clear Manage Market Data
export function clearArbiManageMarketListData() {
    return action(CLEAR_ARBITRAGE_MANAGE_MARKET_DATA)
}