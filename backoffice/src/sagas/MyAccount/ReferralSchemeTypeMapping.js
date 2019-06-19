/**
 * Created By Saloni Rathod
 * Creatde Date 24th May 2019
 * Saga For Referral Scheme Type Mapping 
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import {

    LIST_REFERRAL_SCHEME_TYPE_MAPPING,
    ADD_EDIT_REFERRAL_SCHEME_TYPE_MAPPING,
    CHANGE_STATUS_REFERRAL_SCHEME_TYPE_MAPPING,
    GET_REFERRAL_SCHEME_TYPE_MAPPING_BY_ID,

} from "Actions/types";

// import functions from action
import {

    getReferralSchemeTypeMappingDataSuccess,
    getReferralSchemeTypeMappingDataFailure,
    addEditReferralSchemeTypeMappingSuccess,
    addEditReferralSchemeTypeMappingFailure,
    changeStatusSchemeTypeMappingSuccess,
    changeStatusSchemeTypeMappingFailure,
    getSchemeTypeMappingByIdSuccess,
    getSchemeTypeMappingByIdFailure,

} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';

//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//List Referral Service Detail Data
function* getReferralSchemeTypeMappingDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var sURL = 'api/Referral/ListReferralSchemeTypeMapping?';

    if (payload !== undefined) {
        if (payload.hasOwnProperty('ServiceTypeMstId') && payload.ServiceTypeMstId !== '') {
            sURL += 'ServiceTypeMstId=' + payload.ServiceTypeMstId + '&';
        }
        if (payload.hasOwnProperty('PayTypeId') && payload.PayTypeId !== '') {
            sURL += 'PayTypeId=' + payload.PayTypeId + '&';
        }
        if (payload.hasOwnProperty('Status') && payload.Status !== '') {
            sURL += 'Status=' + payload.Status + '&';
        }
    }
    const response = yield call(swaggerPostAPI, sURL, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getReferralSchemeTypeMappingDataSuccess(response));
        } else {
            yield put(getReferralSchemeTypeMappingDataFailure(response));
        }
    } catch (error) {
        yield put(getReferralSchemeTypeMappingDataFailure(error));
    }
}

//Add Referral Service Detail Data
function* addReferralSchemeTypeMappingAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/AddUpdateReferralSchemeTypeMapping', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addEditReferralSchemeTypeMappingSuccess(response));
        } else {
            yield put(addEditReferralSchemeTypeMappingFailure(response));
        }
    } catch (error) {
        yield put(addEditReferralSchemeTypeMappingFailure(error));
    }
}

//Change Status Referral Service Detail Data
function* changeSchemeTypeMappingAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/ChangeReferralSchemeTypeMappingStatus/' + payload.Id + '/' + payload.Status, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(changeStatusSchemeTypeMappingSuccess(response));
        } else {
            yield put(changeStatusSchemeTypeMappingFailure(response));
        }
    } catch (error) {
        yield put(changeStatusSchemeTypeMappingFailure(error));
    }
}

//Get Referral Service Detail Data By Id
function* getSchemeTypeMappingByIdAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/GetReferralSchemeTypeMappingByid/' + payload.Id, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getSchemeTypeMappingByIdSuccess(response));
        } else {
            yield put(getSchemeTypeMappingByIdFailure(response));
        }
    } catch (error) {
        yield put(getSchemeTypeMappingByIdFailure(error));
    }
}

function* getReferralSchemeTypeMappingData() {
    yield takeEvery(LIST_REFERRAL_SCHEME_TYPE_MAPPING, getReferralSchemeTypeMappingDataAPI);
}

function* addReferralSchemeTypeMapping() {
    yield takeEvery(ADD_EDIT_REFERRAL_SCHEME_TYPE_MAPPING, addReferralSchemeTypeMappingAPI);
}

function* changeSchemeTypeMapping() {
    yield takeEvery(CHANGE_STATUS_REFERRAL_SCHEME_TYPE_MAPPING, changeSchemeTypeMappingAPI);
}

function* getSchemeTypeMappingById() {
    yield takeEvery(GET_REFERRAL_SCHEME_TYPE_MAPPING_BY_ID, getSchemeTypeMappingByIdAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getReferralSchemeTypeMappingData),
        fork(addReferralSchemeTypeMapping),
        fork(changeSchemeTypeMapping),
        fork(getSchemeTypeMappingById)
    ]);
}