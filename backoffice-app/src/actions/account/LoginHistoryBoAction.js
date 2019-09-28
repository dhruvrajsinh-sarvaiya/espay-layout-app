import { LOGIN_HISTORY_LIST_BO, LOGIN_HISTORY_LIST_BO_SUCCESS, LOGIN_HISTORY_LIST_BO_FAILURE, LOGIN_HISTORY_LIST_BO_CLEAR } from "../ActionTypes";
/**
 * Redux Action To Login History List
 */
export const getLoginHistoryListBo = (request) => ({
    type: LOGIN_HISTORY_LIST_BO,
    payload: request
});
/**
* Redux Action Login History List Success
*/
export const getLoginHistoryListBoSuccess = (list) => ({
    type: LOGIN_HISTORY_LIST_BO_SUCCESS,
    payload: list
});
/**
* Redux Action Login History List Failure
*/
export const getLoginHistoryListBoFailure = (error) => ({
    type: LOGIN_HISTORY_LIST_BO_FAILURE,
    payload: error
});

export const clearLoginHistory = (error) => ({
    type: LOGIN_HISTORY_LIST_BO_CLEAR,
 });