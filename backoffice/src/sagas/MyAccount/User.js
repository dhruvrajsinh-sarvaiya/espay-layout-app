/**
 * Auther : Saloni Rathod
 * Created : 26/02/2019
 * User Sagas
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    ADD_USER,
    EDIT_USER,
    CHANGE_USER_STATUS,
    LIST_USER,
    GET_USER_BY_ID,
    REINVITE_USER
} from "Actions/types";
import {
    addUserSuccess,
    addUserFailure,
    editUserSuccess,
    editUserFailure,
    listUserSuccess,
    listUserFailure,
    changeUserStatusSuccess,
    changeUserStatusFailure,
    getUserByIdSuccess,
    getUserByIdFailure,
    reInviteUserSuccess,
    reInviteUserFailure,
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Function for Add  API
function* addUserAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/BackofficeRoleManagement/CreateUser', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addUserSuccess(response));
        } else {
            yield put(addUserFailure(response));
        }
    } catch (error) {
        yield put(addUserFailure(error));
    }
}

//Function for Edit  API
function* editUserAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/EditUser/', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(editUserSuccess(response));
        } else {
            yield put(editUserFailure(response));
        }
    } catch (error) {
        yield put(editUserFailure(error));
    }
}

//Function for List  API
function* listUserAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackofficeRoleManagement/ListUserDetail/' + payload.PageNo + '?PageSize=' + payload.PageSize, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(listUserSuccess(response));
        } else {
            yield put(listUserFailure(response));
        }
    } catch (error) {
        yield put(listUserFailure(error));
    }
}

//Function for Get By ID  API
function* getByIdUserAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackofficeRoleManagement/GetUserDetailById?UserId=' + payload.UserId, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getUserByIdSuccess(response));
        } else {
            yield put(getUserByIdFailure(response));
        }
    } catch (error) {
        yield put(getUserByIdFailure(error));
    }
}

//Function for Change Status  API
function* changeStatusUserAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/ChangeUserStatus/' + payload.Id + '/' + payload.Status, payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(changeUserStatusSuccess(response));
        } else {
            yield put(changeUserStatusFailure(response));
        }
    } catch (error) {
        yield put(changeUserStatusFailure(error));
    }
}

//Function for Reinvite User API
function* reInviteUserAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/ReInviteUser', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(reInviteUserSuccess(response));
        } else {
            yield put(reInviteUserFailure(response));
        }
    } catch (error) {
        yield put(reInviteUserFailure(error));
    }
}

/* Create Sagas method for Add  */
export function* addUserSagas() {
    yield takeEvery(ADD_USER, addUserAPI);
}

/* Create Sagas method for Edit  */
export function* editUserSagas() {
    yield takeEvery(EDIT_USER, editUserAPI);
}

/* Create Sagas method list User   */
export function* listUserSagas() {
    yield takeEvery(LIST_USER, listUserAPI);
}

/* Create Sagas method for Get By ID  */
export function* getByIdUserSagas() {
    yield takeEvery(GET_USER_BY_ID, getByIdUserAPI);
}

/* Create Sagas method for Change Status  */
export function* changeStatusUserSagas() {
    yield takeEvery(CHANGE_USER_STATUS, changeStatusUserAPI);
}

/* Create Sagas method for Reinvite USer  */
export function* reInviteUserSagas() {
    yield takeEvery(REINVITE_USER, reInviteUserAPI);
}

export default function* rootSaga() {
    yield all([
        fork(addUserSagas),
        fork(editUserSagas),
        fork(listUserSagas),
        fork(getByIdUserSagas),
        fork(changeStatusUserSagas),
        fork(reInviteUserSagas)
    ]);
}