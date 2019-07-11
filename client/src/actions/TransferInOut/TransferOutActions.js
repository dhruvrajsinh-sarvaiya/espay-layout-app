import {
  GET_EXTERNALTRANSFER_HISTORY,
  GET_EXTERNALTRANSFER_HISTORY_SUCCESS,
  GET_EXTERNALTRANSFER_HISTORY_FAILURE
} from "../types";

export const getExternalTransferHistory = () => ({
  type: GET_EXTERNALTRANSFER_HISTORY
});

export const getExternalTransferHistorySuccess = response => ({
  type: GET_EXTERNALTRANSFER_HISTORY_SUCCESS,
  payload: response.data
});

export const getExternalTransferHistoryFailure = error => ({
  type: GET_EXTERNALTRANSFER_HISTORY_FAILURE,
  payload: error
});
