/**
 * Created By Bharat Jograna
 * Creatde Date 23 May 2019
 * Saga For Referral Service Detail
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import {

    LIST_REFERRAL_SERVICE_DETAIL,
    ADD_EDIT_REFERRAL_SERVICE_DETAIL,
    CHANGE_STATUS_REFERRAL_SERVICE_DETAIL,
    GET_REFERRAL_SERVICE_DETAIL_BY_ID,

} from "Actions/types";

// import functions from action
import {

    getReferralServiceDetailDataSuccess,
    getReferralServiceDetailDataFailure,
    addReferralServiceDetailSuccess,
    addReferralServiceDetailFailure,
    changeStatusServiceDetailSuccess,
    changeStatusServiceDetailFailure,
    getServiceDetailByIdSuccess,
    getServiceDetailByIdFailure,

} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';

//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//List Referral Service Detail Data
function* getReferralServiceDetailDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var sURL = 'api/Referral/ListReferralServiceDetail?';
    if (payload !== undefined) {
        if (payload.hasOwnProperty('SchemeTypeMappingId') && payload.SchemeTypeMappingId !== '') {
            sURL += 'SchemeTypeMappingId=' + payload.SchemeTypeMappingId + '&';
        }
        if (payload.hasOwnProperty('CreditWalletTypeId') && payload.CreditWalletTypeId !== '') {
            sURL += 'CreditWalletTypeId=' + payload.CreditWalletTypeId + '&';
        }
        if (payload.hasOwnProperty('Status') && payload.Status !== '') {
            sURL += 'Status=' + payload.Status + '&';
        }
    }
    const response = yield call(swaggerPostAPI, sURL, {}, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(getReferralServiceDetailDataSuccess(response));
        } else {
            yield put(getReferralServiceDetailDataFailure(response));
        }
    } catch (error) {
        yield put(getReferralServiceDetailDataFailure(error));
    }
}

//Add Referral Service Detail Data
function* addReferralServiceDetailAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/AddUpdateReferralServiceDetail', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addReferralServiceDetailSuccess(response));
        } else {
            yield put(addReferralServiceDetailFailure(response));
        }
    } catch (error) {
        yield put(addReferralServiceDetailFailure(error));
    }
}

//Change Status Referral Service Detail Data
function* changeServiceDetailAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/ChangeReferralServiceDetailStatus/' + payload.Id + '/' + payload.Status, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(changeStatusServiceDetailSuccess(response));
        } else {
            yield put(changeStatusServiceDetailFailure(response));
        }
    } catch (error) {
        yield put(changeStatusServiceDetailFailure(error));
    }
}

//Get Referral Service Detail Data By Id
function* getServiceDetailByIdAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/GetReferralServiceDetailByid/' + payload.Id, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getServiceDetailByIdSuccess(response));
        } else {
            yield put(getServiceDetailByIdFailure(response));
        }
    } catch (error) {
        yield put(getServiceDetailByIdFailure(error));
    }
}

function* getReferralServiceDetailData() {
    yield takeEvery(LIST_REFERRAL_SERVICE_DETAIL, getReferralServiceDetailDataAPI);
}

function* addReferralServiceDetail() {
    yield takeEvery(ADD_EDIT_REFERRAL_SERVICE_DETAIL, addReferralServiceDetailAPI);
}

function* changeServiceDetail() {
    yield takeEvery(CHANGE_STATUS_REFERRAL_SERVICE_DETAIL, changeServiceDetailAPI);
}

function* getServiceDetailById() {
    yield takeEvery(GET_REFERRAL_SERVICE_DETAIL_BY_ID, getServiceDetailByIdAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getReferralServiceDetailData),
        fork(addReferralServiceDetail),
        fork(changeServiceDetail),
        fork(getServiceDetailById)
    ]);
}