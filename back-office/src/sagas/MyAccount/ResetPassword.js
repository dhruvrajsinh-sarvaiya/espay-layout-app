/**
 * Auth Sagas
 */
import { all,  fork, put, takeEvery } from "redux-saga/effects";

import { RESET_PASSWORD } from "Actions/types";

import { resetPasswordSuccess, resetPasswordFailure } from "Actions/MyAccount";

/**
 * Create User with Email
 */
function* resetPasswordmethod({ payload }) {
  const resetPwd = payload;
  try {
    if (resetPwd !== "") {
      yield put(resetPasswordSuccess(resetPwd));
    } else {
      yield put(resetPasswordFailure(resetPwd));
    }
  } catch (error) {
    yield put(resetPasswordFailure(error));
  }
}

/**
 * Create User with Email
 */
export function* resetPassword() {
  yield takeEvery(RESET_PASSWORD, resetPasswordmethod);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([fork(resetPassword)]);
}
