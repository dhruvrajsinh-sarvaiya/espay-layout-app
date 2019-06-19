/**
 * Auth Sagas
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

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
    //console.log("Call Sagas Try Block For Blockchain");
    if (signUpUserBlockchain.Blockchain !== "") {
      //console.log("Call Sagas Success For Blockchain");
      yield put(signUpUserBlockchainSuccess(signUpUserBlockchain));
      //history.push('/app/dashboard/trading')
    } else {
      //console.log("Call Sagas Failure For Blockchain");
      yield put(signUpUserBlockchainFailure(signUpUserBlockchain));
    }
  } catch (error) {
    //console.log("Call Sagas Catch Block For Blockchain");
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
