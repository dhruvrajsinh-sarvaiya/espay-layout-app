/**
 * SMS Auth Sagas
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { SEND_SMSAUTH, SUBMIT_SEND_SMSAUTH } from "Actions/types";

import {
  sendSmsauthSuccess,
  sendSmsauthFailure,
  submitSendSmsauthSuccess,
  submitSendSmsauthFailure
} from "Actions";

/**
 * Create Send SMS Auth
 */
function* smsAuthChecker({ payload }) {
  const smsAuhtvalue = payload;

  try {
    if (smsAuhtvalue.phoneno !== "") {
      yield put(submitSendSmsauthSuccess(smsAuhtvalue));
    } else {
      yield put(submitSendSmsauthFailure(smsAuhtvalue));
    }
  } catch (error) {
    yield put(submitSendSmsauthFailure(error));
  }
}

/**
 * Create Submit Send SMS Auth
 */
function* submitSmsAuthChecker({ payload }) {
  const submitsmsAuhtvalue = payload;

  try {
    if (submitsmsAuhtvalue.phoneno !== "") {
      yield put(sendSmsauthSuccess(submitsmsAuhtvalue));
    } else {
      yield put(sendSmsauthFailure(submitsmsAuhtvalue));
    }
  } catch (error) {
    yield put(sendSmsauthFailure(error));
  }
}

/**
 * Call Send SMS Auth
 */
export function* sendSmsAuth() {
  yield takeEvery(SEND_SMSAUTH, smsAuthChecker);
}

/**
 * Call Submit Send SMS Auth
 */
export function* submitSendSmsAuth() {
  yield takeEvery(SUBMIT_SEND_SMSAUTH, submitSmsAuthChecker);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([fork(sendSmsAuth), fork(submitSendSmsAuth)]);
}
