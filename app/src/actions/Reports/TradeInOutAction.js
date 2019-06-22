import {
  // Get Outgoing Transaction Report
  GET_OUTGOINGTRANSACTONS_REPORT,
  GET_OUTGOINGTRANSACTONS_REPORT_SUCCESS,
  GET_OUTGOINGTRANSACTONS_REPORT_FAILURE,

  // Get Incoming Transaction Report
  GET_INCOMINGTRANSACTONS_REPORT,
  GET_INCOMINGTRANSACTONS_REPORT_SUCCESS,
  GET_INCOMINGTRANSACTONS_REPORT_FAILURE

} from '../ActionTypes';

// Redux action to Get Outgoing Transaction Report
export const getOutgoingTransactionsReport = () => ({
  type: GET_OUTGOINGTRANSACTONS_REPORT
});

// Redux action to Get Outgoing Transaction Report Success
export const getOutgoingTransactionsReportSuccess = response => ({
  type: GET_OUTGOINGTRANSACTONS_REPORT_SUCCESS,
  payload: response
});

// Redux action to Get Outgoing Transaction Report Failure
export const getOutgoingTransactionsReportFailure = error => ({
  type: GET_OUTGOINGTRANSACTONS_REPORT_FAILURE,
  payload: error
});

// Redux action to Get Incoming Transaction Report
export const getIncomingTransactionsReport = () => ({
  type: GET_INCOMINGTRANSACTONS_REPORT
});

// Redux action to Get Incoming Transaction Report Success
export const getIncomingTransactionsReportSuccess = response => ({
  type: GET_INCOMINGTRANSACTONS_REPORT_SUCCESS,
  payload: response
});

// Redux action to Get Incoming Transaction Report Failure
export const getIncomingTransactionsReportFailure = error => ({
  type: GET_INCOMINGTRANSACTONS_REPORT_FAILURE,
  payload: error
});  