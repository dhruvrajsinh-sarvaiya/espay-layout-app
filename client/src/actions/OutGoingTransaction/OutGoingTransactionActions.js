import {
  GET_OUTGOINGTRANSACTION_REPORT,
  GET_OUTGOINGTRANSACTION_REPORT_SUCCESS,
  GET_OUTGOINGTRANSACTION_REPORT_FAILURE
} from "../types";

export const getOutGoingTransactionReport = () => ({
  type: GET_OUTGOINGTRANSACTION_REPORT
});

export const getOutGoingTransactionReportSuccess = response => ({
  type: GET_OUTGOINGTRANSACTION_REPORT_SUCCESS,
  payload: response
});

export const getOutGoingTransactionReportFailure = error => ({
  type: GET_OUTGOINGTRANSACTION_REPORT_FAILURE,
  payload: error
});
