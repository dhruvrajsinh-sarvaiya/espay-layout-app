import {
    GET_MANAGE_MARKET_LIST,
    GET_MANAGE_MARKET_LIST_SUCCESS,
    GET_MANAGE_MARKET_LIST_FAILURE,

    ADD_MANAGE_MARKET_LIST,
    ADD_MANAGE_MARKET_LIST_SUCCESS,
    ADD_MANAGE_MARKET_LIST_FAILURE,
    ADD_MANAGE_MARKET_LIST_CLEAR,

    UPDATE_MANAGE_MARKET_LIST,
    UPDATE_MANAGE_MARKET_LIST_SUCCESS,
    UPDATE_MANAGE_MARKET_LIST_FAILURE,
    UPDATE_MANAGE_MARKET_LIST_CLEAR,

    GET_TRADING_CURRENCY_LIST,
    GET_TRADING_CURRENCY_LIST_SUCCESS,
    GET_TRADING_CURRENCY_LIST_FAILURE,

    CLEAR_ALL_TRADING_MARKET_DATA

} from '../ActionTypes'
import { action } from '../GlobalActions';

// --------------- for currecny list--------------
//To fetch data
export function GetTradingCurrecnyList() {
    return action(GET_TRADING_CURRENCY_LIST)
}

//On success result
export function GetTradingCurrecnyListSuccess(data) {
    return action(GET_TRADING_CURRENCY_LIST_SUCCESS, { data })
}

//On Failuresss
export function GetTradingCurrecnyListFailure() {
    return action(GET_TRADING_CURRENCY_LIST_FAILURE)
}
// --------------------------------

// --------------- for manage market list--------------
//To fetch data
export function GetMarketList() {
    return action(GET_MANAGE_MARKET_LIST)
}

//On success result
export function GetMarketListSuccess(data) {
    return action(GET_MANAGE_MARKET_LIST_SUCCESS, { data })
}

//On Failure
export function GetMarketListFailure() {
    return action(GET_MANAGE_MARKET_LIST_FAILURE)
}
// --------------------------------


// ------------------ for add Manage Market Data ------------------

//To Add marketData 
export function AddManageMarketData(data) {
    return action(ADD_MANAGE_MARKET_LIST, { data })
}

//On Add marketData  success result
export function AddManageMarketDataSuccess(data) {
    return action(ADD_MANAGE_MARKET_LIST_SUCCESS, { data })
}

//On Add marketData Failure
export function AddManageMarketDataFailure() {
    return action(ADD_MANAGE_MARKET_LIST_FAILURE)
}

// clear marketData 
export function AddManageMarketDataClear() {
    return action(ADD_MANAGE_MARKET_LIST_CLEAR)
}
// ---------------------------------------------------

// ------------------------- for edit marketData------------
//To Edit marketData  
export function EditManageMarketData(data) {
    return action(UPDATE_MANAGE_MARKET_LIST, { data })
}

//On Edit marketData success result
export function EditManageMarketDataSuccess(data) {
    return action(UPDATE_MANAGE_MARKET_LIST_SUCCESS, { data })
}

//On Edit marketData Failure
export function EditManageMarketDataFailure() {
    return action(UPDATE_MANAGE_MARKET_LIST_FAILURE)
}

// clear marketData 
export function editManageMarketDataClear() {
    return action(UPDATE_MANAGE_MARKET_LIST_CLEAR)
}
// ------------

// clear marketData 
export function clearAllTradingMarketData() {
    return action(CLEAR_ALL_TRADING_MARKET_DATA)
}
// ------------