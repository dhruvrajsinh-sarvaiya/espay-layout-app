import {
    // Get Margin Manage Market List
    GET_MARGIN_MANAGE_MARKET_LIST,
    GET_MARGIN_MANAGE_MARKET_LIST_SUCCESS,
    GET_MARGIN_MANAGE_MARKET_LIST_FAILURE,

    // Add Margin Manage Market List
    ADD_MARGIN_MANAGE_MARKET_LIST,
    ADD_MARGIN_MANAGE_MARKET_LIST_SUCCESS,
    ADD_MARGIN_MANAGE_MARKET_LIST_FAILURE,
    ADD_MARGIN_MANAGE_MARKET_LIST_CLEAR,

    // Update Margin Manage Market List
    UPDATE_MARGIN_MANAGE_MARKET_LIST,
    UPDATE_MARGIN_MANAGE_MARKET_LIST_SUCCESS,
    UPDATE_MARGIN_MANAGE_MARKET_LIST_FAILURE,
    UPDATE_MARGIN_MANAGE_MARKET_LIST_CLEAR,

    // Get Margin Currency List
    GET_MARGIN_CURRENCY_LIST,
    GET_MARGIN_CURRENCY_LIST_SUCCESS,
    GET_MARGIN_CURRENCY_LIST_FAILURE,

    // Clear All Margin Market Data
    CLEAR_ALL_MARGIN_MARKET_DATA,

} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux action for Get Market Currency List
export function GetMarginCurrecnyList() {
    return action(GET_MARGIN_CURRENCY_LIST)
}

// Redux action for Get Market Currency List Success
export function GetMarginCurrecnyListSuccess(data) {
    return action(GET_MARGIN_CURRENCY_LIST_SUCCESS, { data })
}

// Redux action for Get Market Currency List Failure
export function GetMarginCurrecnyListFailure() {
    return action(GET_MARGIN_CURRENCY_LIST_FAILURE)
}

// Redux action for Get Margin Market List
export function GetMarginMarketList() {
    return action(GET_MARGIN_MANAGE_MARKET_LIST)
}

// Redux action for Get Margin Market List Success
export function GetMarginMarketListSuccess(data) {
    return action(GET_MARGIN_MANAGE_MARKET_LIST_SUCCESS, { data })
}

// Redux action for Get Margin Market List Failure
export function GetMarginMarketListFailure() {
    return action(GET_MARGIN_MANAGE_MARKET_LIST_FAILURE)
}

// Redux action for Add Margin Market Data
export function AddMarginManageMarketData(data) {
    return action(ADD_MARGIN_MANAGE_MARKET_LIST, { data })
}

// Redux action for Add Margin Market Data Success
export function AddMarginManageMarketDataSuccess(data) {
    return action(ADD_MARGIN_MANAGE_MARKET_LIST_SUCCESS, { data })
}

// Redux action for Add Margin Market Data Failure
export function AddMarginManageMarketDataFailure() {
    return action(ADD_MARGIN_MANAGE_MARKET_LIST_FAILURE)
}

// Redux action for Clear Margin Market Data
export function AddMarginManageMarketDataClear() {
    return action(ADD_MARGIN_MANAGE_MARKET_LIST_CLEAR)
}

// Redux action for Edit Margin Market Data
export function EditMarginManageMarketData(data) {
    return action(UPDATE_MARGIN_MANAGE_MARKET_LIST, { data })
}

// Redux action for Edit Margin Market Data Success
export function EditMarginManageMarketDataSuccess(data) {
    return action(UPDATE_MARGIN_MANAGE_MARKET_LIST_SUCCESS, { data })
}

// Redux action for Edit Margin Market Data Failure
export function EditMarginManageMarketDataFailure() {
    return action(UPDATE_MARGIN_MANAGE_MARKET_LIST_FAILURE)
}

// Redux action for Clear Edit Margin Market Data
export function editMarginManageMarketDataClear() {
    return action(UPDATE_MARGIN_MANAGE_MARKET_LIST_CLEAR)
}

// FOR CLEAR ALL DATA
export function clearAllMarginMarketData() {
    return action(CLEAR_ALL_MARGIN_MARKET_DATA)
}
