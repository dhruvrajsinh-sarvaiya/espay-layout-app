/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Login History List Actions
 */

 //Import action types form type.js
 import {
    LOGIN_HISTORY_LIST,
    LOGIN_HISTORY_LIST_SUCCESS,
    LOGIN_HISTORY_LIST_FAILURE
} from '../types';

/**
 * Redux Action To Login History List
 */
export const loginHistoryList = (data) => ({
    type: LOGIN_HISTORY_LIST,
    payload: data
});

/**
 * Redux Action Login History List Success
 */
export const loginHistoryListSuccess = (list) => ({
    type: LOGIN_HISTORY_LIST_SUCCESS,
    payload: list
});

/**
 * Redux Action Login History List Failure
 */
export const loginHistoryListFailure = (error) => ({
    type: LOGIN_HISTORY_LIST_FAILURE,
    payload: error
});