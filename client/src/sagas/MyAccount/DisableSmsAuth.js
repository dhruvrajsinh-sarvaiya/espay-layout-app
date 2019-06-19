/**
 * SMS Auth Sagas
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { DISABLE_SEND_SMSAUTH, DISABLE_SUBMIT_SEND_SMSAUTH } from "Actions/types";

import {
  sendSmsauthDisableSuccess,
  sendSmsauthDisableFailure,
  submitSendSmsauthDisableSuccess,
  submitSendSmsauthDisableFailure
} from "Actions";

/**
 * Create Send SMS Auth
 */
function* smsAuthDisableChecker({ payload }) {
  const smsAuhtvalue = payload;

  try {
    if (smsAuhtvalue.phoneno !== "") {
      yield put(sendSmsauthDisableSuccess(smsAuhtvalue));
    } else {
      yield put(sendSmsauthDisableFailure(smsAuhtvalue));
    }
  } catch (error) {
    yield put(sendSmsauthDisableFailure(error));
  }
}

/**
 * Create Submit Send SMS Auth
 */
function* submitSmsAuthDisableChecker({ payload }) {
  const submitsmsAuhtvalue = payload;

  try {
    if (submitsmsAuhtvalue.phoneno !== "") {
      yield put(submitSendSmsauthDisableSuccess(submitsmsAuhtvalue));
    } else {
      yield put(signUpUserFailure(submitsmsAuhtvalue));
    }
  } catch (error) {
    yield put(submitSendSmsauthDisableFailure(error));
  }
}

/**
 * Call Send SMS Auth
 */
export function* sendSmsAuthDisable() {
  yield takeEvery(DISABLE_SEND_SMSAUTH, submitSmsAuthDisableChecker);
}

/**
 * Call Submit Send SMS Auth
 */
export function* submitSendSmsAuthDisable() {
  yield takeEvery(DISABLE_SUBMIT_SEND_SMSAUTH, smsAuthDisableChecker);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([fork(sendSmsAuthDisable), fork(submitSendSmsAuthDisable)]);
}
