import { IP_HISTORY_LIST, IP_HISTORY_LIST_SUCCESS, IP_HISTORY_LIST_FAILURE } from "../ActionTypes";
/**
 * Redux Action To IP History List Bo
 */
export const ipHistoryBoList = (data) => ({
    type: IP_HISTORY_LIST,
    payload: data
});
/**
* Redux Action IP History List Bo Success
*/
export const ipHistoryBoListSuccess = (list) => ({
    type: IP_HISTORY_LIST_SUCCESS,
    payload: list
});
/**
* Redux Action IP History List Bo Failure
*/
export const ipHistoryBoListFailure = (error) => ({
    type: IP_HISTORY_LIST_FAILURE,
    payload: error
});