import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import api from "Api";

import {
  GET_TRADING_FEES,
  UPDATE_TRADING_FEES,
  ADD_TRADING_FEES
} from "Actions/types";

// import functions from action
import {
  getTradingFeesSuccess,
  getTradingFeesFailure,
  onUpdateTradingFeesSuccess,
  onUpdateTradingFeesFail,
  addTradingFeesSuccess,
  addTradingFeesFailure
} from "Actions/StackingFees";

const getTradingDataRequest = async () =>
  await api
    .get("stackingFees.js")
    .then(response => response)
    .catch(error => error);

const updateTradingFeesRequest = async trasingfees =>
  await api
    .post("stackingFees.js", trasingfees)
    .then(response => response)
    .catch(error => error);

const addStackingFeesRequest = async payment =>
  await api
    .post("stackingFees.js", payment)
    .then(response => response)
    .catch(error => error);

function* addStackingFeesData({ payload }) {
  try {
    const paymentMethod = yield call(addStackingFeesRequest, payload);
    if (paymentMethod.message) {
      yield put(addTradingFeesSuccess(paymentMethod));
    } else {
      yield put(addTradingFeesFailure(paymentMethod));
    }
  } catch (error) {
    yield put(addTradingFeesFailure(error));
  }
}

export function* addStackingFees() {
  yield takeEvery(ADD_TRADING_FEES, addStackingFeesData);
}

function* getTrading() {
  try {
    const response = yield call(getTradingDataRequest);
    yield put(getTradingFeesSuccess(response));
  } catch (error) {
    yield put(getTradingFeesFailure(error));
  }
}

function* getTradingData() {
  yield takeEvery(GET_TRADING_FEES, getTrading);
}

function* updateTradingFeesData({ payload }) {
  try {
    const tradingFees = yield call(updateTradingFeesRequest, payload);
    if (tradingFees.message) {
      yield put(onUpdateTradingFeesFail(tradingFees.message));
    } else {
      yield put(onUpdateTradingFeesSuccess(tradingFees));
    }
  } catch (error) {
    yield put(onUpdateTradingFeesFail(error));
  }
}

export function* onupdateTradingFeesReport() {
  yield takeEvery(UPDATE_TRADING_FEES, updateTradingFeesData);
}

export default function* rootSaga() {
  yield all([
    fork(getTradingData),
    fork(onupdateTradingFeesReport),
    fork(addStackingFees)
  ]);
}
