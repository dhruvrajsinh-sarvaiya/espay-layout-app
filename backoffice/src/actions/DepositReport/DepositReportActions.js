import {
  GET_DEPOSIT_REPORT,
  GET_DEPOSIT_REPORT_SUCCESS,
  GET_DEPOSIT_REPORT_FAILURE,
  UPDATE_DEPOSIT_REPORT,
  UPDATE_DEPOSIT_REPORT_SUCCESS,
  UPDATE_DEPOSIT_REPORT_FAILURE
} from "../types";

export const getDepositReport = () => ({
  type: GET_DEPOSIT_REPORT
});

export const getDepositReportSuccess = response => ({
  type: GET_DEPOSIT_REPORT_SUCCESS,
  payload: response.data
});

export const getDepositReportFailure = error => ({
  type: GET_DEPOSIT_REPORT_FAILURE,
  payload: error
});

export const onUpdateDepositReport = withdrawalreport => ({
  type: UPDATE_DEPOSIT_REPORT,
  payload: withdrawalreport
});

export const onUpdateDepositReportSuccess = withdrawalreport => ({
  type: UPDATE_DEPOSIT_REPORT_SUCCESS,
  payload: withdrawalreport
});

export const onUpdateDepositReportFail = error => ({
  type: UPDATE_DEPOSIT_REPORT_FAILURE,
  payload: error
});
