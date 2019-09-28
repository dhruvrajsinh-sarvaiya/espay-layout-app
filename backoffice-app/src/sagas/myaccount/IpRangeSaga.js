//Sagas Effects..
import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
//Action Types..
import {
  IP_RANGE_LIST,
  IP_RANGE_UPDATE,
  IP_RANGE_ADD,
  IP_RANGE_DELETE
} from "../../actions/ActionTypes";
//Action methods..
import {
  ipRangeListSuccess,
  ipRangeListFailure,
  updateIpRangeSuccess,
  updateIpRangeFailure,
  addIpRangeSuccess,
  addIpRangeFailure,
  deleteIpRangeSuccess,
  deleteIpRangeFailure
} from "../../actions/account/IpRangeAction";
//Get function form helper for Swagger API Call
import { swaggerGetAPI, swaggerPostAPI, queryBuilder } from "../../api/helper";
import { Method } from "../../controllers/Constants";
import { userAccessToken } from "../../selector";

//Function for ip range List API
function* getIpRangeListAPI({ payload }) {
  let token = yield select(userAccessToken);
  var headers = { 'Authorization': token }
  const response = yield call(swaggerGetAPI, Method.GetIpRange + queryBuilder(payload), {}, headers);
  try {
    yield put(ipRangeListSuccess(response));
  } catch (error) {
    yield put(ipRangeListFailure(error));
  }
}

//Function for Edit ip range API
function* editIpRangeAPI({ payload }) {
  let token = yield select(userAccessToken);
  var headers = { 'Authorization': token }
  const response = yield call(swaggerPostAPI, Method.AllowIpRange, payload, headers);
  try {
    yield put(updateIpRangeSuccess(response));
  }
  catch (error) {
    yield put(updateIpRangeFailure(error));
  }
}

//Function for delete ip range By Id API
function* deleteIpRangeAPI({ payload }) {
  let token = yield select(userAccessToken);
  var headers = { 'Authorization': token }
  const response = yield call(swaggerPostAPI, Method.DeleteIpRange, payload, headers);
  try {
    yield put(deleteIpRangeSuccess(response));
  } catch (error) {
    yield put(deleteIpRangeFailure(error));
  }
}

//Function for ip range API
function* addIpRangeAPI({ payload }) {
  let token = yield select(userAccessToken);
  var headers = { 'Authorization': token }
  const response = yield call(swaggerPostAPI, Method.AllowIpRange, payload, headers);
  try {
    yield put(addIpRangeSuccess(response));
  } catch (error) {
    yield put(addIpRangeFailure(error));
  }
}

/* Create Sagas method for ip range List */
export function* ipRangeListSagas() {
  yield takeEvery(IP_RANGE_LIST, getIpRangeListAPI);
}

/* Create Sagas method for Edit ip range */
export function* editIpRangeSagas() {
  yield takeEvery(IP_RANGE_UPDATE, editIpRangeAPI);
}

/* Create Sagas method for add ip range */
export function* addIpRangeSagas() {
  yield takeEvery(IP_RANGE_ADD, addIpRangeAPI);
}

/* Create Sagas method for delete ip range By Id */
export function* deleteIpRangeSagas() {
  yield takeEvery(IP_RANGE_DELETE, deleteIpRangeAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
  yield all([
    fork(ipRangeListSagas),
    fork(editIpRangeSagas),
    fork(addIpRangeSagas),
    fork(deleteIpRangeSagas)
  ]);
}
