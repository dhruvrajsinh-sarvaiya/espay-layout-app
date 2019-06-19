/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Application Dashboard Sagas
*/
import { all, fork, call, put, takeEvery } from "redux-saga/effects";
import {
    APPLICATION_DASHBOARD,
    ADD_APPLICATION,
    LIST_APPLICATION,
    LIST_ACTIVE_APPLICATION,
    LIST_INACTIVE_APPLICATION,
    ACTIVE_APPLICATION,
    INACTIVE_APPLICATION
} from "Actions/types";
// import functions from action
import {
    getApplicationDataSuccess,
    getApplicationDataFailure,
    addApplicationSuccess,
    addApplicationFailure,
    listApplicationDataSuccess,
    listApplicationDataFailure,
    listActiveApplicationDataSuccess,
    listActiveApplicationDataFailure,
    listInActiveApplicationDataSuccess,
    listInActiveApplicationDataFailure,
    activeApplicationSuccess,
    activeApplicationFailure,
    inactiveApplicationSuccess,
    inactiveApplicationFailure
} from "Actions/MyAccount";
import AppConfig from 'Constants/AppConfig';

//Get function form helper for Swagger API Call
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Display Application Data
function* getApplicationDataAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackOfficeApplication/GetAllCountApplication', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getApplicationDataSuccess(response));
        } else {
            yield put(getApplicationDataFailure(response));
        }
    } catch (error) {
        yield put(getApplicationDataFailure(error));
    }
}

//Add Application Data
function* addApplicationDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeApplication/AddApplication', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addApplicationSuccess(response));
        } else {
            yield put(addApplicationFailure(response));
        }
    } catch (error) {
        yield put(addApplicationFailure(error));
    }
}

//Display List Application Data
function* listApplicationDataAPI({ payload }) {
    var swaggerUrl = 'api/BackOfficeApplication/GetApplicationList/' + payload.PageIndex + '/' + payload.PAGE_SIZE;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(listApplicationDataSuccess(response));
        } else {
            yield put(listApplicationDataFailure(response));
        }
    } catch (error) {
        yield put(listApplicationDataFailure(error));
    }
}

//Display List Active Application Data
function* listActiveApplicationDataAPI({ payload }) {
    var swaggerUrl = 'api/BackOfficeApplication/GetActiveApplicationList/' + payload.PageIndex + '/' + payload.PAGE_SIZE;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(listActiveApplicationDataSuccess(response));
        } else {
            yield put(listActiveApplicationDataFailure(response));
        }
    } catch (error) {
        yield put(listActiveApplicationDataFailure(error));
    }
}

//Display List InActive Application Data
function* listInActiveApplicationDataAPI({ payload }) {
    var swaggerUrl = 'api/BackOfficeApplication/GetDisActiveApplicationList/' + payload.PageIndex + '/' + payload.PAGE_SIZE;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(listInActiveApplicationDataSuccess(response));
        } else {
            yield put(listInActiveApplicationDataFailure(response));
        }
    } catch (error) {
        yield put(listInActiveApplicationDataFailure(error));
    }
}

//Active Application Data
function* activeApplicationDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeApplication/ActiveApplication', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(activeApplicationSuccess(response));
        } else {
            yield put(activeApplicationFailure(response));
        }
    } catch (error) {
        yield put(activeApplicationFailure(error));
    }
}

//InActive Application Data
function* inactiveApplicationDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeApplication/InActiveApplication', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(inactiveApplicationSuccess(response));
        } else {
            yield put(inactiveApplicationFailure(response));
        }
    } catch (error) {
        yield put(inactiveApplicationFailure(error));
    }
}

//Display Application Data
function* getApplicationData() {
    yield takeEvery(APPLICATION_DASHBOARD, getApplicationDataAPI);
}

//Add Application Data
function* addApplicationData() {
    yield takeEvery(ADD_APPLICATION, addApplicationDataAPI);
}

//Display List Application Data
function* listApplicationData() {
    yield takeEvery(LIST_APPLICATION, listApplicationDataAPI);
}

//Display List Active Application Data
function* listActiveApplicationData() {
    yield takeEvery(LIST_ACTIVE_APPLICATION, listActiveApplicationDataAPI);
}

//Display List InActive Application Data
function* listInActiveApplicationData() {
    yield takeEvery(LIST_INACTIVE_APPLICATION, listInActiveApplicationDataAPI);
}

//Active Application Data
function* activeApplicationData() {
    yield takeEvery(ACTIVE_APPLICATION, activeApplicationDataAPI);
}

//InActive Application Data
function* inactiveApplicationData() {
    yield takeEvery(INACTIVE_APPLICATION, inactiveApplicationDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getApplicationData),
        fork(addApplicationData),
        fork(listApplicationData),
        fork(listActiveApplicationData),
        fork(listInActiveApplicationData),
        fork(activeApplicationData),
        fork(inactiveApplicationData)
    ]);
}