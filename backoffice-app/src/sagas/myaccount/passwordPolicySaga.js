//Sagas Effects..
import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";

//Action Types..
import {
  PASSWORD_POLICY_LIST,
  PASSWORD_POLICY_UPDATE,
  PASSWORD_POLICY_ADD,
  PASSWORD_POLICY_DELETE
} from '../../actions/ActionTypes';

//Action methods..
import {
  passwordPolicyListSuccess,
  passwordPolicyListFailure,
  updatePasswordPolicySuccess,
  updatePasswordPolicyFailure,
  addPasswordPolicySuccess,
  addPasswordPolicyFailure,
  deletePasswordPolicySuccess,
  deletePasswordPolicyFailure
} from "../../actions/account/PasswordPolicyAction";
//Get function form helper for Swagger API Call
import { swaggerGetAPI, swaggerPostAPI, queryBuilder } from "../../api/helper";
import { Method } from "../../controllers/Constants";
import { userAccessToken } from "../../selector";


//Function for password policy List API
function* getPasswordPolicyListAPI({ payload }) {
  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call password policy list Api
    const response = yield call(swaggerGetAPI, Method.GetPasswordPolicy + queryBuilder(payload), {}, headers);

    // To set password policy list success response to reducer
    yield put(passwordPolicyListSuccess(response));
  } catch (error) {

    // To set password policy list Failure response to reducer
    yield put(passwordPolicyListFailure(error));
  }
}

//Function for Edit password policy API
function* editPasswordPolicyAPI({ payload }) {
  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call password policy edit Api
    const response = yield call(swaggerPostAPI, Method.PasswordPolicyupdate, payload, headers);

    // To set password policy edit success response to reducer
    yield put(updatePasswordPolicySuccess(response));
  }
  catch (error) {

    // To set password policy edit Failure response to reducer
    yield put(updatePasswordPolicyFailure(error));
  }
}

//Function for delete password policy By Id API
function* deletePasswordPolicyAPI({ payload }) {
  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call password policy delete Api
    const response = yield call(swaggerPostAPI, Method.PasswordPolicyDelete, payload, headers);

    // To set password policy delete success response to reducer
    yield put(deletePasswordPolicySuccess(response));
  } catch (error) {

    // To set password policy delete Failure response to reducer
    yield put(deletePasswordPolicyFailure(error));
  }
}

//Function for password policy API
function* addPasswordPolicyAPI({ payload }) {
  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call password policy add Api
    const response = yield call(swaggerPostAPI, Method.PasswordPolicyAdd, payload, headers);

    // To set password policy add success response to reducer
    yield put(addPasswordPolicySuccess(response));
  } catch (error) {

    // To set password policy add failure response to reducer
    yield put(addPasswordPolicyFailure(error));
  }
}

/* Create Sagas method for password policy List */
export function* passwordPolicyListSagas() {
  yield takeEvery(PASSWORD_POLICY_LIST, getPasswordPolicyListAPI);
}

/* Create Sagas method for Edit password policy */
export function* editPasswordPolicySagas() {
  yield takeEvery(PASSWORD_POLICY_UPDATE, editPasswordPolicyAPI);
}

/* Create Sagas method for add password policy */
export function* addPasswordPolicySagas() {
  yield takeEvery(PASSWORD_POLICY_ADD, addPasswordPolicyAPI);
}

/* Create Sagas method for delete password policy By Id */
export function* deletePasswordPolicySagas() {
  yield takeEvery(PASSWORD_POLICY_DELETE, deletePasswordPolicyAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
  yield all([
    fork(passwordPolicyListSagas),
    fork(editPasswordPolicySagas),
    fork(addPasswordPolicySagas),
    fork(deletePasswordPolicySagas)
  ]);
}
