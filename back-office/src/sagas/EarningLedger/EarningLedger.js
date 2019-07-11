import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import api from "Api";

import { GET_EARNINGLEDGER_REPORT } from "Actions/types";

// import functions from action
import {
  getEarningLedgerReportSuccess,
  getEarningLedgerReportFailure
} from "Actions/EarningLedger";

const getEarningLedgerReportRequest = async payload =>
  await api
    .post("earningLedger.js", { payload })
    .then(response => response)
    .catch(error => error);

function* getEarningLedgerReportData(payload) {
  try {
    const response = yield call(getEarningLedgerReportRequest, payload);
    yield put(getEarningLedgerReportSuccess(response));
  } catch (error) {
    yield put(getEarningLedgerReportFailure(error));
  }
}

function* getEarningLedgerReport() {
  yield takeEvery(GET_EARNINGLEDGER_REPORT, getEarningLedgerReportData);
}

export default function* rootSaga() {
  yield all([fork(getEarningLedgerReport)]);
}
