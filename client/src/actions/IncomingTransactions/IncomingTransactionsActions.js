import {
  GET_INCOMINGTRANSACTONS_REPORT,
  GET_INCOMINGTRANSACTONS_REPORT_SUCCESS,
  GET_INCOMINGTRANSACTONS_REPORT_FAILURE
} from "../types";

export const getIncomingTransactionsReport = () => ({
  type: GET_INCOMINGTRANSACTONS_REPORT
});

export const getIncomingTransactionsReportSuccess = response => ({
  type: GET_INCOMINGTRANSACTONS_REPORT_SUCCESS,
  payload: response
});

export const getIncomingTransactionsReportFailure = error => ({
  type: GET_INCOMINGTRANSACTONS_REPORT_FAILURE,
  payload: error
});
