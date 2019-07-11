import {all, call, fork, put, takeEvery} from "redux-saga/effects";

import {
    GET_EMAIL_API_LIST_REQUEST,
    EDIT_EMAIL_API_REQUEST,
    ADD_EMAIL_API_REQUEST,
    GET_REQUEST_FORMAT,
    GET_ALL_THIRD_PARTY_RESPONSE
} from "Actions/types";

import {
    getEmailApiListSuccess,
    getEmailApiListFail,
    editEmailApiRequestFail,
    editEmailApiRequestSuccess,
    addEmailApiRequestFail,
    addEmailApiRequestSuccess,
    getAllRequestFormatSuccess,
    getAllRequestFormatFail,
    getAllThirdPartyAPIResposeSuccess,
    getAllThirdPartyAPIResposeFail
} from "Actions/EmailApiManager";

import {swaggerPostAPI,swaggerGetAPI} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';

function* displayEmailAPIList() {
    yield takeEvery(GET_EMAIL_API_LIST_REQUEST, displayEmailApiListSaga);
}

function* editEmailAPIRequest() {
    yield takeEvery(EDIT_EMAIL_API_REQUEST,editEmailApiRequestSaga)
}

function* addEmailAPIRequest() {
    yield takeEvery(ADD_EMAIL_API_REQUEST,addEmailApiRequestSaga)
}

function* getAllRequestFormat() {
    yield takeEvery(GET_REQUEST_FORMAT, getAllRequestFormatsaga);
}

function* getAllThirdPartyResponse() {
    yield takeEvery(GET_ALL_THIRD_PARTY_RESPONSE, getAllThirdPartyResponseSaga);
}

function* editEmailApiRequestSaga({payload}){
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/MasterConfiguration/UpdateCommunicationServiceConfig/UpdateCommunicationServiceConfig', payload.emailRequest, headers);
    //const response = {ReturnCode:0,ReturnMsg:"Successfully Update API"};
    try {
        if (response.ReturnCode === 0) {
            yield put(editEmailApiRequestSuccess(response));
        } else {
            yield put(editEmailApiRequestFail(response));
        }
    } catch (error) {
        yield put(editEmailApiRequestFail(error));
    }
}

function* addEmailApiRequestSaga({payload}){
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/MasterConfiguration/AddCommunicationServiceConfig/AddCommunicationServiceConfig', payload.emailRequest, headers);
    //const response = {ReturnCode:0,ReturnMsg:"Successfully Add API"};
    try {
        if (response.ReturnCode === 0) {
            yield put(addEmailApiRequestSuccess(response));
        } else {
            yield put(addEmailApiRequestFail(response));
        }
    } catch (error) {
        yield put(addEmailApiRequestFail(error));
    }
}

function* displayEmailApiListSaga({payload}) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var api ="api/MasterConfiguration/GetCommunicationServiceConfiguration/GetCommunicationServiceConfig/"+payload.type;
    var response= yield call(swaggerGetAPI,api,{},headers);

    try{

        if(response.ReturnCode ===0){
            yield put(getEmailApiListSuccess(response));
        }else{
            yield put(getEmailApiListFail(response));
        }
    }catch(error){
        yield put(getEmailApiListFail(error));
    }
}

function* getAllRequestFormatsaga({payload}) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var api ="api/MasterConfiguration/GetAllRequestFormat/GetAllRequestFormat";
    var response= yield call(swaggerGetAPI,api,{},headers);

    try{

        if(response.ReturnCode ===0){
            yield put(getAllRequestFormatSuccess(response));
        }else{
            yield put(getAllRequestFormatFail(response));
        }
    }catch(error){
        yield put(getAllRequestFormatFail(error));
    }
}

function* getAllThirdPartyResponseSaga({payload}) {
    var api ="api/TransactionConfiguration/GetAllThirdPartyAPIRespose";
	var headers = { 'Authorization': AppConfig.authorizationToken };
    var response= yield call(swaggerGetAPI,api,{},headers);

    try{

        if(response.ReturnCode ===0){
            yield put(getAllThirdPartyAPIResposeSuccess(response));
        }else{
            yield put(getAllThirdPartyAPIResposeFail(response));
        }
    }catch(error){
        yield put(getAllThirdPartyAPIResposeFail(error));
    }
}

export default function* rootSaga() {
    yield all([
        fork(displayEmailAPIList),
        fork(editEmailAPIRequest),
        fork(addEmailAPIRequest),
        fork(getAllRequestFormat),
        fork(getAllThirdPartyResponse),
    ]);
}