import {
  // IP History
  IP_HISTORY_LIST,
  IP_HISTORY_LIST_SUCCESS,
  IP_HISTORY_LIST_FAILURE
} from '../ActionTypes';

/**
 * Redux Action To IP History List
 */
export const ipHistoryList = (data) => ({
  type: IP_HISTORY_LIST,
  payload: data
});

/**
* Redux Action IP History List Success
*/
export const ipHistoryListSuccess = (list) => ({
  type: IP_HISTORY_LIST_SUCCESS,
  payload: list
});

/**
* Redux Action IP History List Failure
*/
export const ipHistoryListFailure = (error) => ({
  type: IP_HISTORY_LIST_FAILURE,
  payload: error
});