/**
 * Auth Sagas
 */
import { all, fork, put, takeEvery } from "redux-saga/effects";

import { SIGNUP_USERS_BLOCKCHAIN } from "Actions/types";

import {
  signUpUserBlockchainSuccess,
  signUpUserBlockchainFailure
} from "Actions";

/**
 * Create User with Blockchain
 */
function* createUserWithBlockchainPassword({ payload }) {
  const signUpUserBlockchain = payload;
  try {
    if (signUpUserBlockchain.Blockchain !== "") {
      yield put(signUpUserBlockchainSuccess(signUpUserBlockchain));
    } else {
      yield put(signUpUserBlockchainFailure(signUpUserBlockchain));
    }
  } catch (error) {
    yield put(signUpUserBlockchainFailure(error));
  }
}

/**
 * Create User with Blockchain
 */
export function* createUserBlockchainAccount() {
  yield takeEvery(SIGNUP_USERS_BLOCKCHAIN, createUserWithBlockchainPassword);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([fork(createUserBlockchainAccount)]);
}
