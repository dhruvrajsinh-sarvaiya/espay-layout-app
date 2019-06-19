/* 
    Developer : Kevin Ladani
    Date : 17-01-2019
    File Comment : MyAccount Password Policy Dashboard Sagas
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    LIST_PASSWORD_POLICY_DASHBOARD,
    ADD_PASSWORD_POLICY_DASHBOARD,
    DELETE_PASSWORD_POLICY_DASHBOARD,
    UPDATE_PASSWORD_POLICY_DASHBOARD,
} from "Actions/types";
// import functions from action
import {
    getPasswordPolicyDataSuccess,
    getPasswordPolicyDataFailure,
    addPasswordPolicyDataSuccess,
    addPasswordPolicyDataFailure,
    deletePasswordPolicyDataSuccess,
    deletePasswordPolicyDataFailure,
    updatePasswordPolicyDataSuccess,
    updatePasswordPolicyDataFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
//Get function form helper for Swagger API Call
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Display Password Policy Data
function* getPasswordPolicyDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/PasswordPolicy/GetPasswordPolicy?PageIndex=' + payload.PageIndex + '&Page_Size=' + payload.PAGE_SIZE, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getPasswordPolicyDataSuccess(response));
        } else {
            yield put(getPasswordPolicyDataFailure(response));
        }
    } catch (error) {
        yield put(getPasswordPolicyDataFailure(error));
    }
}

//Function for Add Password Policy Configuration API
function* addPasswordPolicyAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/PasswordPolicy/PasswordPolicyAdd', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addPasswordPolicyDataSuccess(response));
        } else {
            yield put(addPasswordPolicyDataFailure(response));
        }
    } catch (error) {
        yield put(addPasswordPolicyDataFailure(error));
    }
}

//Function for Delete Password Policy Configuration API
function* deletePasswordPolicyAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/PasswordPolicy/PasswordPolicyDelete', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(deletePasswordPolicyDataSuccess(response));
        } else {
            yield put(deletePasswordPolicyDataFailure(response));
        }
    } catch (error) {
        yield put(deletePasswordPolicyDataFailure(error));
    }
}

//Function for Uppdate Password Policy Configuration API
function* updatePasswordPolicyAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/PasswordPolicy/PasswordPolicyupdate', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(updatePasswordPolicyDataSuccess(response));
        } else {
            yield put(updatePasswordPolicyDataFailure(response));
        }
    } catch (error) {
        yield put(updatePasswordPolicyDataFailure(error));
    }
}

//Display Password Policy Data
function* getPasswordPolicyValue() {
    yield takeEvery(LIST_PASSWORD_POLICY_DASHBOARD, getPasswordPolicyDataAPI);
}

/* Create Sagas method for Add Password Policy Configuration */
export function* addPasswordPolicyValue() {
    yield takeEvery(ADD_PASSWORD_POLICY_DASHBOARD, addPasswordPolicyAPI);
}

/* Create Sagas method for Delete Password Policy Configuration */
export function* deletePasswordPolicyValue() {
    yield takeEvery(DELETE_PASSWORD_POLICY_DASHBOARD, deletePasswordPolicyAPI);
}

/* Create Sagas method for Update Password Policy Configuration */
export function* updatePasswordPolicyValue() {
    yield takeEvery(UPDATE_PASSWORD_POLICY_DASHBOARD, updatePasswordPolicyAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getPasswordPolicyValue),
        fork(addPasswordPolicyValue),
        fork(deletePasswordPolicyValue),
        fork(updatePasswordPolicyValue),
    ]);
}