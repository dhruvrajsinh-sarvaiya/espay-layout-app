/**
 * Create by Sanjay 
 * Created Date 25/03/2019
 * Saga File For Service Provider CRUD Opration 
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import {
    LIST_SERVICE_PROVIDER,
    ADD_SERVICE_PROVIDER,
    UPDATE_SERVICE_PROVIDER
} from "Actions/types";

// import functions from action
import {
    listServiceProviderSuccess,
    listServiceProviderFailure,
    addServiceProviderSuccess,
    addServiceProviderFailure,
    updateServiceProviderSuccess,
    updateServiceProviderFailure
} from "Actions/ServiceProvider";

import AppConfig from 'Constants/AppConfig';

//Get function form helper for Swagger API Call
import { swaggerGetAPI, swaggerPostAPI } from 'Helpers/helpers';

//Display List Of API Method 
function* listServiceProviderAPI({payload}) { 
    var headers = { 'Authorization': AppConfig.authorizationToken }, url="";
    //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
    if(payload.IsArbitrage !== undefined && payload.IsArbitrage) {
        url = 'api/TransactionConfiguration/GetProviderListArbitrage';
    } else {
        url = 'api/TransactionConfiguration/GetProviderList';//add existing
    }
    
    const response = yield call(swaggerGetAPI, url, {}, headers);    

    try {
        if (response.ReturnCode === 0) {
            yield put(listServiceProviderSuccess(response));
        } else {
            yield put(listServiceProviderFailure(response));
        }
    } catch (error) {
        yield put(listServiceProviderFailure(error));
    }
}

//Add Api Method Data
function* addServiceProviderAPI({ payload }) {

    var headers = { 'Authorization': AppConfig.authorizationToken }, url="";
    //code change by devang parekh (12-6-2019) for handle // code changearbitrage configuration detail
    if(payload.IsArbitrage !== undefined && payload.IsArbitrage) {
        url = 'api/TransactionConfiguration/AddServiceProviderArbitrage';
    } else {
        url = 'api/TransactionConfiguration/AddServiceProvider';
    }
    
    const response = yield call(swaggerPostAPI, url, payload, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(addServiceProviderSuccess(response));
        } else {
            yield put(addServiceProviderFailure(response));
        }
    } catch (error) {
        yield put(addServiceProviderFailure(error));
    }
}

//Update Api Method
function* updateServiceProviderAPI({ payload }) {

    var headers = { 'Authorization': AppConfig.authorizationToken }, url="";
    //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
    if(payload.IsArbitrage !== undefined && payload.IsArbitrage) {
        url = 'api/TransactionConfiguration/UpdateServiceProviderArbitrage';
    } else {
        url = 'api/TransactionConfiguration/UpdateServiceProvider';
    }
    
    const response = yield call(swaggerPostAPI, url, payload, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(updateServiceProviderSuccess(response));
        } else {
            yield put(updateServiceProviderFailure(response));
        }
    } catch (error) {
        yield put(updateServiceProviderFailure(error));
    }
}

function* listServiceProvider() {
    yield takeEvery(LIST_SERVICE_PROVIDER, listServiceProviderAPI);
}

function* addServiceProviderData() {
    yield takeEvery(ADD_SERVICE_PROVIDER, addServiceProviderAPI);
}

function* updateServiceProviderData() {
    yield takeEvery(UPDATE_SERVICE_PROVIDER, updateServiceProviderAPI);
}

export default function* rootSaga() {
    yield all([
        fork(listServiceProvider),
        fork(addServiceProviderData),
        fork(updateServiceProviderData)
    ]);
}