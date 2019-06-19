/**
 * Edit Profile saga file is used to call api and response send to call function and handle actions functions (code added by Parth Jani 17-9-2018)
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { ANTI_PHISHING_CODE } from "Actions/types";

import {
  getAntiPhishingCodeSuccess,
  getAntiPhishingCodeFailure
} from "Actions/MyAccount";

const getAntiPhishingCodeAPIRequest = async request =>
  await api
    .get("transHistory.js")
    .then(response => response)
    .catch(error => error);

function* antiPhishingCodeAPI({ payload }) {
  try {
    //const response = yield call(getAntiPhishingCodeAPIRequest,payload);
    if (data.length > 0) {
      yield put(getAntiPhishingCodeSuccess(data));
    } else {
      yield put(getAntiPhishingCodeFailure(errorMsg));
    }
  } catch (error) {
    yield put(getAntiPhishingCodeFailure(error));
  }
}

function* getAntiPhishingCodeReport() {
  yield takeEvery(ANTI_PHISHING_CODE, antiPhishingCodeAPI);
}

export default function* rootSaga() {
  yield all([fork(getAntiPhishingCodeReport)]);
}
