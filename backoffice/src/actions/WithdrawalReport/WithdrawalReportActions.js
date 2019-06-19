import {
  GET_WITHDRAWAL_REPORT,
  GET_WITHDRAWAL_REPORT_SUCCESS,
  GET_WITHDRAWAL_REPORT_FAILURE,
  UPDATE_WITHDRAWAL_REPORT,
  UPDATE_WITHDRAWAL_REPORT_SUCCESS,
  UPDATE_WITHDRAWAL_REPORT_FAILURE
} from "../types";

export const getWithdrawalReport = () => ({
  type: GET_WITHDRAWAL_REPORT
});

export const getWithdrawalReportSuccess = response => ({
  type: GET_WITHDRAWAL_REPORT_SUCCESS,
  payload: response.data
});

export const getWithdrawalReportFailure = error => ({
  type: GET_WITHDRAWAL_REPORT_FAILURE,
  payload: error
});

export const onUpdateWhithdrawalReport = withdrawalreport => ({
  type: UPDATE_WITHDRAWAL_REPORT,
  payload: withdrawalreport
});

export const onUpdateWhithdrawalReportSuccess = withdrawalreport => ({
  type: UPDATE_WITHDRAWAL_REPORT_SUCCESS,
  payload: withdrawalreport
});

export const onUpdateWhithdrawalReportFail = error => ({
  type: UPDATE_WITHDRAWAL_REPORT_FAILURE,
  payload: error
});
