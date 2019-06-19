import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import api from "Api";

import { GET_TRANSACTIONRETRY_REPORT } from "Actions/types";

// import functions from action
import {
  getTransactionRetryReportSuccess,
  getTransactionRetryReportFailure
} from "Actions/TransactionRetry";

const getTransactionRetryReportRequest = async payload =>
  await api
    .post("transactionRetry.js", { payload })
    .then(response => response)
    .catch(error => error);

function* getTransactionRetryReportData(payload) {
  try {
    const response = yield call(getTransactionRetryReportRequest, payload);
    yield put(getTransactionRetryReportSuccess(response));
  } catch (error) {
    yield put(getTransactionRetryReportFailure(error));
  }
}

function* getTransactionRetryReport() {
  yield takeEvery(GET_TRANSACTIONRETRY_REPORT, getTransactionRetryReportData);
}

export default function* rootSaga() {
  yield all([fork(getTransactionRetryReport)]);
}
