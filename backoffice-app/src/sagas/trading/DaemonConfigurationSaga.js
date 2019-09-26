// sagas For Daemon Configuration Data Actions 
// effects for redux-saga
import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";

// types for set actions and reducers
import {
  //for get daemon list
  GET_DAEMON_CONFIGURE_DATA,

  //for add daemon
  ADD_DAEMON_CONFIGURE_DATA,

  //for edit daemon
  EDIT_DAEMON_CONFIGURE_DATA
} from "../../actions/ActionTypes";

// action sfor set data or response
import {
  //for get daemon list
  getDaemonSuccess,
  getDaemonFailure,

  //for add daemon
  addDaemonSuccess,
  addDaemonFailure,

  //for edit daemon
  editDaemonSuccess,
  editDaemonFailure,
} from "../../actions/Trading/DaemonConfigureAction";
import { swaggerPostAPI } from "../../api/helper";
import { Method } from "../../controllers/Methods";
import { userAccessToken } from "../../selector";

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getDaemonData),
    fork(addDaemonData),
    fork(editDaemonData)
  ]);
}

// Sagas Function for get Daemon Configuration Data
function* getDaemonData() {
  yield takeEvery(GET_DAEMON_CONFIGURE_DATA, getDaemonDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getDaemonDataDetail() {

  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call daemon config list api
    const response = yield call(swaggerPostAPI, Method.GetAllDemonConfig, {}, headers);

    // To set daemon config list success response to reducer
    yield put(getDaemonSuccess(response));
  }
  catch (error) {

    // To set daemon config list failure response to reducer
    yield put(getDaemonFailure(error));
  }
}

// Sagas Function for add  Daemon Configuration Data
function* addDaemonData() {
  yield takeEvery(ADD_DAEMON_CONFIGURE_DATA, addDaemonDataDetail);
}

// Function for set response to add Daemon Configuration data and Call Function for Api Call
function* addDaemonDataDetail({ payload }) {

  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call add daemon config api
    const response = yield call(swaggerPostAPI, Method.AddDemonConfiguration, payload, headers);

    // To set add daemon config success response to reducer
    yield put(addDaemonSuccess(response));
  }
  catch (error) {

    // To set add daemon config failure response to reducerF
    yield put(addDaemonFailure(error));
  }
}

// Sagas Function for edit  Daemon Configuration Data 
function* editDaemonData() {
  yield takeEvery(EDIT_DAEMON_CONFIGURE_DATA, editDaemonDataDetail);
}

// Function for set response to edit  Daemon Configuration Data and Call Function for Api Call
function* editDaemonDataDetail({ payload }) {

  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call edit daemon config api
    const response = yield call(swaggerPostAPI, Method.UpdateDemonConfiguration, payload, headers);

    // To set edit daemon config success response to reducer
    yield put(editDaemonSuccess(response));
  } catch (error) {

    // To set edit daemon config failure response to reducer
    yield put(editDaemonFailure(error));
  }

}


