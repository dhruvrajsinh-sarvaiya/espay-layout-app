// Actions For Transaction Charge Report By Tejas Date :5/10/2018

// import types
import {
  GET_TRANSACTION_CHARGE,
  GET_TRANSACTION_CHARGE_SUCCESS,
  GET_TRANSACTION_CHARGE_FAILURE
} from "Actions/types";

//action for getTransaction Charge Report and set type for reducers
export const getTransactionCharge = Pair => ({
  type: GET_TRANSACTION_CHARGE,
  payload: { Pair }
});

//action for set Success and data to Transaction Charge Report and set type for reducers
export const getTransactionChargeSuccess = response => ({
  type: GET_TRANSACTION_CHARGE_SUCCESS,
  payload: response.data
});

//action for set failure and error to  Transaction Charge Report and set type for reducers
export const getTransactionChargeFailure = error => ({
  type: GET_TRANSACTION_CHARGE_FAILURE,
  payload: error
});
