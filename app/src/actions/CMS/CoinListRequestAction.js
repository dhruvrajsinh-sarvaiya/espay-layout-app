import {
    // Get Coin List Request
    GET_COINLIST_REQUEST,
    GET_COINLIST_REQUEST_SUCCESS,
    GET_COINLIST_REQUEST_FAILURE,

    // Add Coinlist Request
    ADD_COINLIST_REQUEST,
    ADD_COINLIST_REQUEST_SUCCESS,
    ADD_COINLIST_REQUEST_FAILURE,

    // Add Coinlist Request Clear
    ADD_COINLIST_REQUEST_CLEAR
} from '../ActionTypes';

/**
 * Redux Action for Get Coinlist
 */
export const getCoinlistRequest = () => ({
    type: GET_COINLIST_REQUEST
});

/**
 * Redux Action Get Coinlist Success
 */
export const getCoinlistRequestSuccess = (response) => ({
    type: GET_COINLIST_REQUEST_SUCCESS,
    payload: response
});

/**
 * Redux Action Get Coinlist Failure
 */
export const getCoinlistRequestFailure = (error) => ({
    type: GET_COINLIST_REQUEST_FAILURE,
    payload: error
});

/**
 * Add coin list request form
 */
export const addCoinListRequest = (request) => ({
    type: ADD_COINLIST_REQUEST,
    payload: { request }
});

/**
 * Add coin list request form Success
 */
export const addCoinListRequestSuccess = (response) => ({
    type: ADD_COINLIST_REQUEST_SUCCESS,
    payload: response
});

/**
 * Add coin list request form Failure
 */
export const addCoinListRequestFailure = (error) => ({
    type: ADD_COINLIST_REQUEST_FAILURE,
    payload: error
});

/**
 * Add clear
 */
export const addCoinListRequestClear = () => ({
    type: ADD_COINLIST_REQUEST_CLEAR,
});