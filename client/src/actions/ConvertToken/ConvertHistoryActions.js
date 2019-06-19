/* 
    Developer : Nishant Vadgama
    Date : 22-09-2018
    File Comment : Convert Token History actions 
*/

import {
  GET_CTHISTORY,
  GET_CTHISTORY_SUCCESS,
  GET_CTHISTORY_FAILURE
} from "../types";

export const getConvertHistory = () => ({
  type: GET_CTHISTORY
});

export const getConvertHistorySuccess = payload => ({
  type: GET_CTHISTORY_SUCCESS,
  payload: payload.data
});

export const getConvertHistoryFailure = error => ({
  type: GET_CTHISTORY_FAILURE,
  error: error
});
