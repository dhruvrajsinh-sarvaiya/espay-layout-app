import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import api from "Api";

import { GET_DEPOSIT_REPORT, UPDATE_DEPOSIT_REPORT } from "Actions/types";

// import functions from action
import {
  getDepositReportSuccess,
  getDepositReportFailure,
  onUpdateDepositReportSuccess,
  onUpdateDepositReportFail
} from "Actions/DepositReport";

const getDepositReportRequest = async () =>
  await api
    .get("depositReport.js")
    .then(response => response)
    .catch(error => error);

const updateDepositReportRequest = async depositReport =>
  await api
    .post("depositReport.js", depositReport)
    .then(response => response)
    .catch(error => error);

function* getDepositReportData() {
  try {
    const response = yield call(getDepositReportRequest);
    yield put(getDepositReportSuccess(response));
  } catch (error) {
    yield put(getDepositReportFailure(error));
  }
}

// Used for call function for update Deposit Report
function* updateDepositReportData({ payload }) {
  try {
    const deposit = yield call(updateDepositReportRequest, payload);
    if (deposit.message) {
      yield put(onUpdateDepositReportFail(deposit.message));
    } else {
      yield put(onUpdateDepositReportSuccess(deposit));
    }
  } catch (error) {
    yield put(onUpdateDepositReportFail(error));
  }
}

export function* onUpdateDepositAddresReport() {
  yield takeEvery(UPDATE_DEPOSIT_REPORT, updateDepositReportData);
}

function* getDepositReport() {
  yield takeEvery(GET_DEPOSIT_REPORT, getDepositReportData);
}

export default function* rootSaga() {
  yield all([fork(getDepositReport), fork(onUpdateDepositAddresReport)]);
}
