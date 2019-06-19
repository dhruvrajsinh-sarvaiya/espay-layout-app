/**
 * Author : Saloni Rathod
 * Created : 20/03/2019
 * Social Trading History
 */
import {
    // Social Trading History
    SOCIAL_TRADING_HISTORY_LIST,
    SOCIAL_TRADING_HISTORY_LIST_SUCCESS,
    SOCIAL_TRADING_HISTORY_LIST_FAILURE


} from '../types';

/**
 * Redux Action To SOCIAL TRADING HISTORY
 */
export const socialTradingHistoryList = (data) => ({
    type: SOCIAL_TRADING_HISTORY_LIST,
    payload: data
});

/**
 * Redux Action SOCIAL TRADING HISTORY Success
 */
export const socialTradingHistoryListSuccess = (list) => ({
    type: SOCIAL_TRADING_HISTORY_LIST_SUCCESS,
    payload: list
});

/**
 * Redux Action SOCIAL TRADING HISTORY Failure
 */
export const socialTradingHistoryListFailure = (error) => ({
    type: SOCIAL_TRADING_HISTORY_LIST_FAILURE,
    payload: error
});