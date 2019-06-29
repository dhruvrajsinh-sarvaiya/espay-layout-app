/**
 * Auth Sagas
 */
import { all, fork, put, takeEvery } from "redux-saga/effects";

import { SIGNUP_USERS } from "Actions/types";

import { signUpUserSuccess, signUpUserFailure } from "Actions";

/**
 * Create User with Email
 */
function* createUserWithEmailPassword({ payload }) {
  const signUpUser = payload.user;
  try {
    if (signUpUser.email !== "") {
      yield put(signUpUserSuccess(signUpUser));
    } else {
      yield put(signUpUserFailure(signUpUser));
    }
  } catch (error) {
    yield put(signUpUserFailure(error));
  }
}

/**
 * Create User with Email
 */
export function* createUserAccount() {
  yield takeEvery(SIGNUP_USERS, createUserWithEmailPassword);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([fork(createUserAccount)]);
}
