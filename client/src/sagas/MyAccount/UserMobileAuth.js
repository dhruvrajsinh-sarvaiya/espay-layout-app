/**
 * Auth Sagas
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { SIGNUP_USERS_MOBILE } from "Actions/types";

import { signUpUserMobileSuccess, signUpUserMobileFailure } from "Actions";

/**
 * Create User with Mobile
 */
function* createUserWithMobilePassword({ payload }) {
  const signUpUserMobile = payload;
  try {
    //console.log("Call Sagas Try Block For Mobile");
    if (signUpUserMobile.mobile !== "") {
      yield put(signUpUserMobileSuccess(signUpUserMobile));
    } else {
      //console.log("Call Sagas Failure For Mobile");
      yield put(signUpUserMobileFailure(signUpUserMobile));
    }
  } catch (error) {
    //console.log("Call Sagas Catch Block For Mobile");
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
