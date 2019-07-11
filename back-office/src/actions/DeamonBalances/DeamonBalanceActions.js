import {
  GET_DEAMONBALANCE_REPORT,
  GET_DEAMONBALANCE_REPORT_SUCCESS,
  GET_DEAMONBALANCE_REPORT_FAILURE
} from "../types";

export const getDeamonBalances = payload => ({
  type: GET_DEAMONBALANCE_REPORT,
  payload: payload
});

export const getDeamonBalancesSuccess = response => ({
  type: GET_DEAMONBALANCE_REPORT_SUCCESS,
  payload: response.data
});

export const getDeamonBalancesFailure = error => ({
  type: GET_DEAMONBALANCE_REPORT_FAILURE,
  payload: error
});
