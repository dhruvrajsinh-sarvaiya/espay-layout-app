/* 
    Developer : Kevin Ladani
    Date : 24-12-2018
    File Comment : MyAccount Domain Dashboard Sagas
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    DOMAIN_DASHBOARD,
    ADD_DOMAIN,
    LIST_DOMAIN,
    LIST_ACTIVE_DOMAIN,
    LIST_INACTIVE_DOMAIN,
    ACTIVE_DOMAIN,
    INACTIVE_DOMAIN,
} from "Actions/types";
// import functions from action
import {
    getDomainDataSuccess,
    getDomainDataFailure,
    addDomainSuccess,
    addDomainFailure,
    listDomainDataSuccess,
    listDomainDataFailure,
    listActiveDomainDataSuccess,
    listActiveDomainDataFailure,
    listInActiveDomainDataSuccess,
    listInActiveDomainDataFailure,
    activeDomainSuccess,
    activeDomainFailure,
    inactiveDomainSuccess,
    inactiveDomainFailure,
} from "Actions/MyAccount";
import AppConfig from 'Constants/AppConfig';
//Get function form helper for Swagger API Call
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';


//Display Domain Data
function* getDomainDataAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, '/api/BackOfficeOrganization/GetAllCountDomain', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getDomainDataSuccess(response));
        } else {
            yield put(getDomainDataFailure(response));
        }
    } catch (error) {
        yield put(getDomainDataFailure(error));
    }
}

//Add Domain Data
function* addDomainDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/BackOfficeOrganization/AddDomain', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addDomainSuccess(response));
        } else {
            yield put(addDomainFailure(response));
        }
    } catch (error) {
        yield put(addDomainFailure(error));
    }
}

//Display List Domain Data
function* listDomainDataAPI({ payload }) {
    var swaggerUrl = '/api/BackOfficeOrganization/GetDomainList/' + payload.PageIndex + '/' + payload.PAGE_SIZE;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(listDomainDataSuccess(response));
        } else {
            yield put(listDomainDataFailure(response));
        }
    } catch (error) {
        yield put(listDomainDataFailure(error));
    }
}

//Display List Active Domain Data
function* listActiveDomainDataAPI({ payload }) {
    var swaggerUrl = '/api/BackOfficeOrganization/GetActiveDomainList/' + payload.PageIndex + '/' + payload.PAGE_SIZE;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(listActiveDomainDataSuccess(response));
        } else {
            yield put(listActiveDomainDataFailure(response));
        }
    } catch (error) {
        yield put(listActiveDomainDataFailure(error));
    }
}

//Display List InActive Domain Data
function* listInActiveDomainDataAPI({ payload }) {
    var swaggerUrl = '/api/BackOfficeOrganization/GetDisActiveDomainList/' + payload.PageIndex + '/' + payload.PAGE_SIZE;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(listInActiveDomainDataSuccess(response));
        } else {
            yield put(listInActiveDomainDataFailure(response));
        }
    } catch (error) {
        yield put(listInActiveDomainDataFailure(error));
    }
}

//Active Domain Data
function* activeDomainDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/BackOfficeOrganization/ActiveDomain', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(activeDomainSuccess(response));
        } else {
            yield put(activeDomainFailure(response));
        }
    } catch (error) {
        yield put(activeDomainFailure(error));
    }
}

//InActive Domain Data
function* inactiveDomainDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/BackOfficeOrganization/InActiveDomain', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(inactiveDomainSuccess(response));
        } else {
            yield put(inactiveDomainFailure(response));
        }
    } catch (error) {
        yield put(inactiveDomainFailure(error));
    }
}

//Display Domain Data
function* getDomainData() {
    yield takeEvery(DOMAIN_DASHBOARD, getDomainDataAPI);
}

//Add Domain Data
function* addDomainData() {
    yield takeEvery(ADD_DOMAIN, addDomainDataAPI);
}

//Display List Domain Data
function* listDomainData() {
    yield takeEvery(LIST_DOMAIN, listDomainDataAPI);
}

//Display List Active Domain Data
function* listActiveDomainData() {
    yield takeEvery(LIST_ACTIVE_DOMAIN, listActiveDomainDataAPI);
}


//Display List InActive Domain Data
function* listInActiveDomainData() {
    yield takeEvery(LIST_INACTIVE_DOMAIN, listInActiveDomainDataAPI);
}

//Active Domain Data
function* activeDomainData() {
    yield takeEvery(ACTIVE_DOMAIN, activeDomainDataAPI);
}

//InActive Domain Data
function* inactiveDomainData() {
    yield takeEvery(INACTIVE_DOMAIN, inactiveDomainDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getDomainData),
        fork(addDomainData),
        fork(listDomainData),
        fork(listActiveDomainData),
        fork(listInActiveDomainData),
        fork(activeDomainData),
        fork(inactiveDomainData),
    ]);
}