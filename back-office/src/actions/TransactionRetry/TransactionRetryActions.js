import {
  GET_TRANSACTIONRETRY_REPORT,
  GET_TRANSACTIONRETRY_REPORT_SUCCESS,
  GET_TRANSACTIONRETRY_REPORT_FAILURE
} from "../types";

export const getTransactionRetryReport = payload => ({
  type: GET_TRANSACTIONRETRY_REPORT,
  payload: payload
});

export const getTransactionRetryReportSuccess = response => ({
  type: GET_TRANSACTIONRETRY_REPORT_SUCCESS,
  payload: response.data
});

export const getTransactionRetryReportFailure = error => ({
  type: GET_TRANSACTIONRETRY_REPORT_FAILURE,
  payload: error
});
