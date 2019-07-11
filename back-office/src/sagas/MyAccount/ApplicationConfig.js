/**
 * Create By Sanjay 
 * Date :10/01/2019 
 * Saga for Application Configuration
 */
import { all, fork, call, put, takeEvery } from "redux-saga/effects";
import {
    ADD_APP_CONFIGURATION,
    GET_DOMAIN_DATA,
    GET_APPLICATION_LIST,
    GET_APPLICATION_BY_ID,
    GET_ALL_APPLICATION_DATA,
    UPDATE_APP_CONFIGURATION_DATA
} from "Actions/types";
// import functions from action
import {
    addAppConfigurationSuccess,
    addAppConfigurationFailure,
    getAppDomainDataSuccess,
    getAppDomainDataFailure,
    getApplicationListSuccess,
    getApplicationListFailure,
    getApplicationByIdSuccess,
    getApplicationByIdFailure,
    getAllApplicationDataSuccess,
    getAllApplicationDataFailure,
    updateApplicationDataSuccess,
    updateApplicationDataFailure
} from "Actions/MyAccount";
import AppConfig from 'Constants/AppConfig';

//Get function form helper for Swagger API Call
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Get Domain Data
function* getDomainDataAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackOfficeApplication/GetUserWiseDomainData', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getAppDomainDataSuccess(response));
        } else {
            yield put(getAppDomainDataFailure(response));
        }
    } catch (error) {
        yield put(getAppDomainDataFailure(error));
    }
}

//Add Application Config Data
function* addAppConfigurationDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeApplication/UserWiseCreateApplication', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addAppConfigurationSuccess(response));
        } else {
            yield put(addAppConfigurationFailure(response));
        }
    } catch (error) {
        yield put(addAppConfigurationFailure(error));
    }
}

//Get Application List
function* getAppConfigListAPI({ payload }) {
    var swaggerUrl = 'api/BackOfficeApplication/GetUserWiseApplicationList/' + payload.PageIndex + '/' + payload.PAGE_SIZE;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getApplicationListSuccess(response));
        } else {
            yield put(getApplicationListFailure(response));
        }
    } catch (error) {
        yield put(getApplicationListFailure(error));
    }
}

//Get Application By Id
function* getAppConfigByIdAPI({ payload }) {
    var swaggerUrl = 'api/BackOfficeApplication/GetUserWiseApplicationData?Id=' + payload;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getApplicationByIdSuccess(response));
        } else {
            yield put(getApplicationByIdFailure(response));
        }
    } catch (error) {
        yield put(getApplicationByIdFailure(error));
    }
}

//Get All Application for Dropdown
function* getAllApplicationDataAPI() {
    var swaggerUrl = 'api/BackOfficeApplication/GetAllApplicationData';
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getAllApplicationDataSuccess(response));
        } else {
            yield put(getAllApplicationDataFailure(response));
        }
    } catch (error) {
        yield put(getAllApplicationDataFailure(error));
    }
}

//Update Application Config Data
function* updateAppConfigurationDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeApplication/UpdateUserWiseApplicationData', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(updateApplicationDataSuccess(response));
        } else {
            yield put(updateApplicationDataFailure(response));
        }
    } catch (error) {
        yield put(updateApplicationDataFailure(error));
    }
}

//Get Domain Data
function* getAppDomainData() {
    yield takeEvery(GET_DOMAIN_DATA, getDomainDataAPI);
}


//Get Application Data
function* getAppConfigList() {
    yield takeEvery(GET_APPLICATION_LIST, getAppConfigListAPI);
}

//Get Application By Id
function* getAppConfigById() {
    yield takeEvery(GET_APPLICATION_BY_ID, getAppConfigByIdAPI);
}

//Add Application Config Data
function* addApplicationData() {
    yield takeEvery(ADD_APP_CONFIGURATION, addAppConfigurationDataAPI);
}

//Get All Application Data
function* getAllApplicationData() {
    yield takeEvery(GET_ALL_APPLICATION_DATA, getAllApplicationDataAPI);
}

//Update Application Config Data
function* updateApplicationData() {
    yield takeEvery(UPDATE_APP_CONFIGURATION_DATA, updateAppConfigurationDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(addApplicationData),
        fork(getAppDomainData),
        fork(getAppConfigList),
        fork(getAppConfigById),
        fork(getAllApplicationData),
        fork(updateApplicationData)
    ]);
}