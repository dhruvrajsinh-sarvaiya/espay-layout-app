import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import api from "Api";

import {
  GET_PAYMENTMETHOD,
  UPDATE_PAYMENTMETHOD,
  ADD_PAYMENTMETHOD
} from "Actions/types";

// import functions from action
import {
  getPaymentMethodSuccess,
  getPaymentMethodFailure,
  onUpdatePaymentMethodSuccess,
  onUpdatePaymentMethodFail,
  addPaymentMethodSuccess,
  addPaymentMethodFailure
} from "Actions/PaymentMethod";

const getPaymentMethodRequest = async () =>
  await api
    .get("paymentMethods.js")
    .then(response => response)
    .catch(error => error);

const updatePaymentMethodRequest = async payment =>
  await api
    .post("paymentMethods.js", payment)
    .then(response => response)
    .catch(error => error);

const addPaymentMethodRequest = async payment =>
  await api
    .post("paymentMethods.js", payment)
    .then(response => response)
    .catch(error => error);

function* addPaymentMethodData({ payload }) {
  try {
    const paymentMethod = yield call(
      addPaymentMethodRequest,
      payload.paymentMethod
    );
    if (paymentMethod.message) {
      yield put(addPaymentMethodSuccess(paymentMethod));
    } else {
      yield put(addPaymentMethodSuccess(paymentMethod));
    }
  } catch (error) {
    yield put(addPaymentMethodFailure(error));
  }
}

export function* addPaymentMethod() {
  yield takeEvery(ADD_PAYMENTMETHOD, addPaymentMethodData);
}

function* getPaymentMethodData() {
  try {
    const response = yield call(getPaymentMethodRequest);
    yield put(getPaymentMethodSuccess(response));
  } catch (error) {
    yield put(getPaymentMethodFailure(error));
  }
}

function* getPaymentMethod() {
  yield takeEvery(GET_PAYMENTMETHOD, getPaymentMethodData);
}

function* updatePaymentMethodData({ payload }) {
  try {
    const paymentMethod = yield call(
      updatePaymentMethodRequest,
      payload.payment
    );
    if (paymentMethod.message) {
      yield put(onUpdatePaymentMethodFail(paymentMethod.message));
    } else {
      yield put(onUpdatePaymentMethodSuccess(paymentMethod));
    }
  } catch (error) {
    yield put(onUpdatePaymentMethodFail(error));
  }
}

export function* onupdatePaymentMethod() {
  yield takeEvery(UPDATE_PAYMENTMETHOD, updatePaymentMethodData);
}

export default function* rootSaga() {
  yield all([
    fork(getPaymentMethod),
    fork(onupdatePaymentMethod),
    fork(addPaymentMethod)
  ]);
}
