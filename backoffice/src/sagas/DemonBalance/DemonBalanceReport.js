import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import api from "Api";

import { GET_DEAMONBALANCE_REPORT } from "Actions/types";

// import functions from action
import {
  getDeamonBalancesSuccess,
  getDeamonBalancesFailure
} from "Actions/DeamonBalances";

const getDeamonBalanceReportRequest = async payload =>
  await api
    .post("deamonBalances.js", { payload })
    .then(response => response)
    .catch(error => error);

function* getDeamonBalanceReportData(payload) {
  try {
    const response = yield call(getDeamonBalanceReportRequest, payload);
    yield put(getDeamonBalancesSuccess(response));
  } catch (error) {
    yield put(getDeamonBalancesFailure(error));
  }
}

function* getDeamonBalanceReport() {
  yield takeEvery(GET_DEAMONBALANCE_REPORT, getDeamonBalanceReportData);
}

export default function* rootSaga() {
  yield all([fork(getDeamonBalanceReport)]);
}
