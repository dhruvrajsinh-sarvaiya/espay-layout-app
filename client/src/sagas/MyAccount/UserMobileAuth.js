/**
 * Auth Sagas
 */
import { all, fork, put, takeEvery } from "redux-saga/effects";

import { SIGNUP_USERS_MOBILE } from "Actions/types";

import { signUpUserMobileSuccess, signUpUserMobileFailure } from "Actions";

/**
 * Create User with Mobile
 */
function* createUserWithMobilePassword({ payload }) {
  const signUpUserMobile = payload;
  try {
    if (signUpUserMobile.mobile !== "") {
      yield put(signUpUserMobileSuccess(signUpUserMobile));
    } else {
      yield put(signUpUserMobileFailure(signUpUserMobile));
    }
  } catch (error) {
    yield put(signUpUserMobileFailure(error));
  }
}

/**
 * Create User with Mobile
 */
export function* createUserMobileAccount() {
  yield takeEvery(SIGNUP_USERS_MOBILE, createUserWithMobilePassword);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([fork(createUserMobileAccount)]);
}
