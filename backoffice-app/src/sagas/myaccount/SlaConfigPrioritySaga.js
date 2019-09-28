//Sagas Effects..
import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";

//Action Types..
import {
  LIST_SLA,
  EDIT_SLA,
  ADD_SLA,
  DELETE_SLA
} from '../../actions/ActionTypes';

//Action methods..
import {
  slaConfigurationListSuccess,
  slaConfigurationListFailure,
  editSLAConfigurationSuccess,
  addSLAConfigurationSuccess,
  addSLAConfigurationFailure,
  deleteSLAConfigurationSuccess,
  deleteSLAConfigurationFailure
} from '../../actions/account/SlaConfigPriorityAction';
import { userAccessToken } from '../../selector';
import { Method } from '../../controllers/Constants';
//Get function form helper for Swagger API Call
import { swaggerGetAPI, swaggerPostAPI, queryBuilder } from "../../api/helper";

//Function for SLA Configuration List API
function* getSLAConfigurationListAPI({ payload }) {

  try {

    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call priority list Api
    const response = yield call(swaggerGetAPI, Method.GetComplaintPriority + queryBuilder(payload), {}, headers);

    // To set priority list success response to reducer
    yield put(slaConfigurationListSuccess(response));
  } catch (error) {

    // To set priority list failure response to reducer
    yield put(slaConfigurationListFailure(error));
  }
}

//Function for Edit SLA Configuration API
function* editSLAConfigurationAPI({ payload }) {

  try {

    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call priority edit Api
    const response = yield call(swaggerPostAPI, Method.ComplaintPriorityUpdate, payload, headers);

    // To set priority edit success response to reducer
    yield put(editSLAConfigurationSuccess(response));
  }
  catch (error) {

    // To set priority edit failure response to reducer
    yield put(editSLAConfigurationFailure(error));
  }
}

//Function for Get SLA Configuration By Id API
function* deleteSLAConfigurationAPI({ payload }) {

  try {

    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call priority delete Api
    const response = yield call(swaggerPostAPI, Method.ComplaintPriorityDelete, payload, headers);

    // To set priority delete success response to reducer
    yield put(deleteSLAConfigurationSuccess(response));
  } catch (error) {
    // To set priority delete failure response to reducer
    yield put(deleteSLAConfigurationFailure(error));
  }
}

//Function for add SLA Configuration API
function* addSLAConfigurationAPI({ payload }) {

  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call priority add Api
    const response = yield call(swaggerPostAPI, Method.ComplaintPriorityAdd, payload, headers);

    // To set priority add success response to reducer
    yield put(addSLAConfigurationSuccess(response));
  } catch (error) {

    // To set priority add failure response to reducer
    yield put(addSLAConfigurationFailure(error));
  }
}

/* Create Sagas method for SLA Configuration List */
export function* slaConfigurationListSagas() {
  yield takeEvery(LIST_SLA, getSLAConfigurationListAPI);
}

/* Create Sagas method for Edit SLA Configuration */
export function* editSLAConfigurationSagas() {
  yield takeEvery(EDIT_SLA, editSLAConfigurationAPI);
}

/* Create Sagas method for Replay SLA Configuration */
export function* addSLAConfigurationSagas() {
  yield takeEvery(ADD_SLA, addSLAConfigurationAPI);
}

/* Create Sagas method for get SLA Configuration Conversion By Id */
export function* deleteSLAConfigurationSagas() {
  yield takeEvery(DELETE_SLA, deleteSLAConfigurationAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
  yield all([
    fork(slaConfigurationListSagas),
    fork(editSLAConfigurationSagas),
    fork(addSLAConfigurationSagas),
    fork(deleteSLAConfigurationSagas)
  ]);
}
