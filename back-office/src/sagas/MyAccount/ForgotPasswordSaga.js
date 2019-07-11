/**
 * Auth Sagas
 */
import { all, fork, put, takeEvery } from "redux-saga/effects";

import { FORGOT_PASSWORD } from "Actions/types";

import {
  forgotPasswordSuccess,
  forgotPasswordFailure
} from "Actions/MyAccount";

/**
 * Create User with Email
 */
function* forgotPasswordmethod({ payload }) {
  const forgotPwd = payload;
  try {
    if (forgotPwd !== "") {
      yield put(forgotPasswordSuccess(forgotPwd));
    } else {
      yield put(forgotPasswordFailure(forgotPwd));
    }
  } catch (error) {
    yield put(forgotPasswordFailure(error));
  }
}

/**
 * Create User with Email
 */
export function* forgotPassword() {
  yield takeEvery(FORGOT_PASSWORD, forgotPasswordmethod);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([fork(forgotPassword)]);
}
