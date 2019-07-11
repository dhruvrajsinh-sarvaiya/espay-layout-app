import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import api from "Api";

import { GET_TRANSFERINOUT_REPORT } from "Actions/types";

// import functions from action
import {
  getTransferINOUTSuccess,
  getTransferINOUTFailure
} from "Actions/TransferINAndOUT";

const getTransferInOutRequest = async payload =>
  await api
    .post("transferInOut.js", { payload })
    .then(response => response)
    .catch(error => error);

function* getTransferInOutData(payload) {
  try {
    const response = yield call(getTransferInOutRequest, payload);
    yield put(getTransferINOUTSuccess(response));
  } catch (error) {
    yield put(getTransferINOUTFailure(error));
  }
}

function* getTransferInOutReport() {
  yield takeEvery(GET_TRANSFERINOUT_REPORT, getTransferInOutData);
}

export default function* rootSaga() {
  yield all([fork(getTransferInOutReport)]);
}
