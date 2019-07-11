/**
 * Create By Sanjay 
 * Created Date 19/03/2019
 * Saga For Rest API Method 
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import {
    LIST_API_METHOD,
    ADD_API_METHOD,
    UPDATE_API_METHOD,
    LIST_SYSTEM_RESET_METHOD,
    LIST_SOCKET_METHOD
} from "Actions/types";

// import functions from action
import {
    getApiMethodDataSuccess,
    getApiMethodDataFailure,
    addApiMethodSuccess,
    addApiMethodFailure,
    updateApiMethodSuccess,
    updateApiMethodFailure,
    getSystemResetMethodDataSuccess,
    getSystemResetMethodDataFailure,
    getSocketMethodDataSuccess,
    getSocketMethodDataFailure
} from "Actions/RestAPIMethod";

import AppConfig from 'Constants/AppConfig';

//Get function form helper for Swagger API Call
import { swaggerGetAPI, swaggerPostAPI } from 'Helpers/helpers';

//Display List Of API Method 
function* getApiMethodListAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackOfficeAPIConfiguration/GetAPIMethods', {}, headers);    
    try {
        if (response.ReturnCode === 0) {
            yield put(getApiMethodDataSuccess(response));
        } else {
            yield put(getApiMethodDataFailure(response));
        }
    } catch (error) {
        yield put(getApiMethodDataFailure(error));
    }
}

//Add Api Method Data
function* addApiMethodAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeAPIConfiguration/AddAPIMethod', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addApiMethodSuccess(response));
        } else {
            yield put(addApiMethodFailure(response));
        }
    } catch (error) {
        yield put(addApiMethodFailure(error));
    }
}

//Update Api Method
function* updateApiMetodAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeAPIConfiguration/UpdateAPIMethod', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(updateApiMethodSuccess(response));
        } else {
            yield put(updateApiMethodFailure(response));
        }
    } catch (error) {
        yield put(updateApiMethodFailure(error));
    }
}

//Get System Reset Method List
function* getSystemResetAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackOfficeAPIConfiguration/GetSystemRestMethods', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getSystemResetMethodDataSuccess(response));
        } else {
            yield put(getSystemResetMethodDataFailure(response));
        }
    } catch (error) {
        yield put(getSystemResetMethodDataFailure(error));
    }
}

//Get Socket Method List
function* getSocketMethodAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/ExchangeFeedConfiguration/GetSocketMethods', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getSocketMethodDataSuccess(response));
        } else {
            yield put(getSocketMethodDataFailure(response));
        }
    } catch (error) {
        yield put(getSocketMethodDataFailure(error));
    }
}

function* getApiMethodList() {
    yield takeEvery(LIST_API_METHOD, getApiMethodListAPI);
}

function* addApiMethod() {
    yield takeEvery(ADD_API_METHOD, addApiMethodAPI);
}

function* updateApiMetod() {
    yield takeEvery(UPDATE_API_METHOD, updateApiMetodAPI);
}

function* getSystemReset() {
    yield takeEvery(LIST_SYSTEM_RESET_METHOD, getSystemResetAPI);
}

function* getSocketMethod() {
    yield takeEvery(LIST_SOCKET_METHOD, getSocketMethodAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getApiMethodList),
        fork(addApiMethod),
        fork(updateApiMetod),
        fork(getSystemReset),
        fork(getSocketMethod)
    ]);
}