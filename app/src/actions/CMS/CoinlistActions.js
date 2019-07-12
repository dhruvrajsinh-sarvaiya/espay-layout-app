import {
    // Coin List
    GET_COINLIST,
    GET_COINLIST_SUCCESS,
    GET_COINLIST_FAILURE,
    GET_COINLIST_CLEAR
} from '../ActionTypes';

/**
 * Redux Action for Get Coinlist
 */
export const getCoinlist = () => ({
    type: GET_COINLIST
});

/**
 * Redux Action Get Coinlist Success
 */
export const getCoinlistSuccess = (response) => ({
    type: GET_COINLIST_SUCCESS,
    payload: response
});

/**
 * Redux Action Get Coinlist Failure
 */
export const getCoinlistFailure = (error) => ({
    type: GET_COINLIST_FAILURE,
    payload: error
});

/**
 * Redux Action for clear Coinlist
 */
export const clearCoinlist = () => ({
    type: GET_COINLIST_CLEAR
});