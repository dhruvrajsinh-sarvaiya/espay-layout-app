import {
  GET_INTERNALTRANSFER_HISTORY,
  GET_INTERNALTRANSFER_HISTORY_SUCCESS,
  GET_INTERNALTRANSFER_HISTORY_FAILURE
} from "../types";

export const getInternalTransferHistory = () => ({
  type: GET_INTERNALTRANSFER_HISTORY
});

export const getInternalTransferHistorySuccess = response => ({
  type: GET_INTERNALTRANSFER_HISTORY_SUCCESS,
  payload: response.data
});

export const getInternalTransferHistoryFailure = error => ({
  type: GET_INTERNALTRANSFER_HISTORY_FAILURE,
  payload: error
});
