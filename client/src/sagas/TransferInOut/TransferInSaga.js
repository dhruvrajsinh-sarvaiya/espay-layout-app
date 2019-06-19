import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import api from "Api";

import { GET_INTERNALTRANSFER_HISTORY } from "Actions/types";

// import functions from action
import {
  getInternalTransferHistorySuccess,
  getInternalTransferHistoryFailure
} from "Actions/TransferInOut";

const getInternalTransferHistoryRequest = async () =>
  await api
    .get("internaltransfer.js")
    .then(response => response)
    .catch(error => error);

function* getInternalTransferHistoryData() {
  try {
    const response = yield call(getInternalTransferHistoryRequest);
    yield put(getInternalTransferHistorySuccess(response));
  } catch (error) {
    yield put(getInternalTransferHistoryFailure(error));
  }
}

function* getInternalTransferHistory() {
  yield takeEvery(GET_INTERNALTRANSFER_HISTORY, getInternalTransferHistoryData);
}

export default function* rootSaga() {
  yield all([fork(getInternalTransferHistory)]);
}
