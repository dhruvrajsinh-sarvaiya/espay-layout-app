import {
  GET_EARNINGLEDGER_REPORT,
  GET_EARNINGLEDGER_REPORT_SUCCESS,
  GET_EARNINGLEDGER_REPORT_FAILURE
} from "../types";

export const getEarningLedgerReport = payload => ({
  type: GET_EARNINGLEDGER_REPORT,
  payload: payload
});

export const getEarningLedgerReportSuccess = response => ({
  type: GET_EARNINGLEDGER_REPORT_SUCCESS,
  payload: response.data
});

export const getEarningLedgerReportFailure = error => ({
  type: GET_EARNINGLEDGER_REPORT_FAILURE,
  payload: error
});
