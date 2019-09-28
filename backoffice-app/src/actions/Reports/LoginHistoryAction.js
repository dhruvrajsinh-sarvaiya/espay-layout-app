import {
  LOGIN_HISTORY_LIST,
  LOGIN_HISTORY_LIST_SUCCESS,
  LOGIN_HISTORY_LIST_FAILURE
} from '../ActionTypes';

/**
 * Redux Action To Login History List
 */
export const loginHistoryList = (LoginHistoryReqObj) => ({
  type: LOGIN_HISTORY_LIST,
  payload: LoginHistoryReqObj
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