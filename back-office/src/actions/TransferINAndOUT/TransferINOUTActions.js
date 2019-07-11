import {
  GET_TRANSFERINOUT_REPORT,
  GET_TRANSFERINOUT_REPORT_SUCCESS,
  GET_TRANSFERINOUT_REPORT_FAILURE
} from "../types";

export const getTransferINOUT = payload => ({
  type: GET_TRANSFERINOUT_REPORT,
  payload: payload
});

export const getTransferINOUTSuccess = response => ({
  type: GET_TRANSFERINOUT_REPORT_SUCCESS,
  payload: response.data
});

export const getTransferINOUTFailure = error => ({
  type: GET_TRANSFERINOUT_REPORT_FAILURE,
  payload: error
});
