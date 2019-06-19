/**
 * Auth Sagas
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { SIGNUP_USERS } from "Actions/types";

import { signUpUserSuccess, signUpUserFailure } from "Actions";

/**
 * Create User with Email
 */
function* createUserWithEmailPassword({ payload }) {
  const signUpUser = payload.user;
  try {
    //console.log("Call Sagas Try Block");
    //console.log(signUpUser.email);

    if (signUpUser.email !== "") {
      yield put(signUpUserSuccess(signUpUser));
    } else {
      //console.log("Call Sagas Failure");
      yield put(signUpUserFailure(signUpUser));
    }
  } catch (error) {
    //console.log("Call Sagas Catch Block");
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
