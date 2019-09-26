// CoinListFieldAction.js
import {
    // for get Coin List Field
    GET_COIN_LIST_FIELDS,
    GET_COIN_LIST_FIELDS_SUCCESS,
    GET_COIN_LIST_FIELDS_FAILURE,

    // for update data
    UPDATE_COIN_LIST_FIELDS,
    UPDATE_COIN_LIST_FIELDS_SUCCESS,
    UPDATE_COIN_LIST_FIELDS_FAILURE,

    // for clear Coin List field Data
    CLEAR_COIN_LIST_FIELDS_DATA
} from '../ActionTypes'
import { action } from '../GlobalActions'


// for get Coin List Field
export function getCoinListFieldData() {
    return action(GET_COIN_LIST_FIELDS)
}
// success Data of Coin List Field
export function getCoinListFieldDataSuccess(data) {
    return action(GET_COIN_LIST_FIELDS_SUCCESS, { data })
}
// failure Data Coin List Field
export function getCoinListFieldDataFailure() {
    return action(GET_COIN_LIST_FIELDS_FAILURE)
}

// for update Coin List Field
export function updateCoinListFieldData(payload = {}) {
    return action(UPDATE_COIN_LIST_FIELDS, { payload })
}
// update success Data of Coin List Field 
export function updateCoinListFieldDataSuccess(data) {
    return action(UPDATE_COIN_LIST_FIELDS_SUCCESS, { data })
}
// update failure Data of Coin List Field 
export function updateCoinListFieldDataFailure() {
    return action(UPDATE_COIN_LIST_FIELDS_FAILURE)
}
// Clear Data Coin List Field
export function clearCoinListFieldData() {
    return action(CLEAR_COIN_LIST_FIELDS_DATA)
}