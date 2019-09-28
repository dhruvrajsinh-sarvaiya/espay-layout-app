// UserCoinListRequestActions.js
import {
    // User Coin List Request
    GET_USER_COIN_LIST_REQUEST,
    GET_USER_COIN_LIST_REQUEST_SUCCESS,
    GET_USER_COIN_LIST_REQUEST_FAILURE,

    // Clear User Coin List Request
    CLEAR_USER_COIN_LIST_REQUEST,

    // Get Coint List Request Dashboard Count
    GET_COIN_LIST_REQ_DASHBOARD_COUNT,
    GET_COIN_LIST_REQ_DASHBOARD_COUNT_SUCCESS,
    GET_COIN_LIST_REQ_DASHBOARD_COUNT_FAILURE
} from '../ActionTypes';
import { action } from '../GlobalActions';

// for get User Coin List Request
export function getUserCoinListRequestData() {
    return action(GET_USER_COIN_LIST_REQUEST)
}
// success Data of User Coin List Request
export function getUserCoinListRequestDataSuccess(data) {
    return action(GET_USER_COIN_LIST_REQUEST_SUCCESS, { data })
}
// failure Data User Coin List Request
export function getUserCoinListRequestDataFailure() {
    return action(GET_USER_COIN_LIST_REQUEST_FAILURE)
}
// Clear Data User Coin List Request
export function clearUserCoinListRequest() {
    return action(CLEAR_USER_COIN_LIST_REQUEST)
}

// for get Coin List Request Dashboard Count
export function getCoinListReqCount() {
    return action(GET_COIN_LIST_REQ_DASHBOARD_COUNT)
}
// success Data of Coin List Request Dashboard Count
export function getCoinListReqCountSuccess(data) {
    return action(GET_COIN_LIST_REQ_DASHBOARD_COUNT_SUCCESS, { data })
}
// failure Data Coin List Request Dashboard Count
export function getCoinListReqCountFailure() {
    return action(GET_COIN_LIST_REQ_DASHBOARD_COUNT_FAILURE)
}