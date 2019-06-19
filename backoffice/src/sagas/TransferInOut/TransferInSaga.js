import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import api from "Api";

import { GET_INTERNALTRANSFER_HISTORY } from "Actions/types";

// import functions from action
import {
  getInternalTransferHistorySuccess,
  getInternalTransferHistoryFailure
} from "Actions/TransferInOut";

// fetch transferIn history data from API
const getInternalTransferHistoryRequest = async () =>
  await api
    .get("transferinout.js")
    .then(response => response)
    .catch(error => error);

// Used for call function for get Transferin History
function* getInternalTransferHistoryData() {
  try {
    const response = yield call(getInternalTransferHistoryRequest);
    yield put(getInternalTransferHistorySuccess(response));
  } catch (error) {
    yield put(getInternalTransferHistoryFailure(error));
  }
}

// dispatch action for get transferIn
function* getInternalTransferHistory() {
  yield takeEvery(GET_INTERNALTRANSFER_HISTORY, getInternalTransferHistoryData);
}

export default function* rootSaga() {
  yield all([fork(getInternalTransferHistory)]);
}
