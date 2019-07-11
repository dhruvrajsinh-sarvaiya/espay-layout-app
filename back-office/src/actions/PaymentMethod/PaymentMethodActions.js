import {
  GET_PAYMENTMETHOD,
  GET_PAYMENTMETHOD_SUCCESS,
  GET_PAYMENTMETHOD_FAILURE,
  UPDATE_PAYMENTMETHOD,
  UPDATE_PAYMENTMETHOD_SUCCESS,
  UPDATE_PAYMENTMETHOD_FAILURE,
  ADD_PAYMENTMETHOD,
  ADD_PAYMENTMETHOD_SUCCESS,
  ADD_PAYMENTMETHOD_FAILURE
} from "../types";

export const addPaymentMethod = payment => ({
  type: ADD_PAYMENTMETHOD,
  payload: payment
});

export const addPaymentMethodSuccess = payment => ({
  type: ADD_PAYMENTMETHOD_SUCCESS,
  payload: payment
});

export const addPaymentMethodFailure = error => ({
  type: ADD_PAYMENTMETHOD_FAILURE,
  payload: error
});

export const getPaymentMethod = () => ({
  type: GET_PAYMENTMETHOD
});

export const getPaymentMethodSuccess = response => ({
  type: GET_PAYMENTMETHOD_SUCCESS,
  payload: response.data
});

export const getPaymentMethodFailure = error => ({
  type: GET_PAYMENTMETHOD_FAILURE,
  payload: error
});

export const onUpdatePaymentMethod = payment => ({
  type: UPDATE_PAYMENTMETHOD,
  payload: payment
});

export const onUpdatePaymentMethodSuccess = payment => ({
  type: UPDATE_PAYMENTMETHOD_SUCCESS,
  payload: payment
});

export const onUpdatePaymentMethodFail = error => ({
  type: UPDATE_PAYMENTMETHOD_FAILURE,
  payload: error
});
