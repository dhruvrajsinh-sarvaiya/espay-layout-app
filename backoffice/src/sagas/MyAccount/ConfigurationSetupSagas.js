/**
 * Create By Sanjay 
 * Created Date 09/02/2019
 */

//Sagas Effects..
import { all, fork, put, takeEvery } from 'redux-saga/effects'

//Action Types..
import {
    ADD_CONFIGURATION_SETUP
} from "Actions/types";

//Action methods..
import {
    addConfigurationSetupSuccess,
    addConfigurationSetupFailure
} from "Actions/MyAccount";

function* addConfigurationSetupAPI({payload}) {
  try {
      yield put(addConfigurationSetupSuccess(payload));
  } catch (error) {
    yield put(addConfigurationSetupFailure(error));
  }
}

function* addConfiSetup() {
  yield takeEvery(ADD_CONFIGURATION_SETUP, addConfigurationSetupAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
  yield all([
    fork(addConfiSetup),
  ]);
}
