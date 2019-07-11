/**
 * Created By Sanjay
 * Created Date 12/02/2019
 * Saga File For Referral PayType
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import {
    LIST_REFERRAL_PAY_TYPE,
    ADD_REFERRAL_PAY_TYPE,
    UPDATE_REFERRAL_PAY_TYPE,
    ACTIVE_REFERRAL_PAY_TYPE,
    INACTIVE_REFERRAL_PAY_TYPE,
    GET_REFERRAL_PAY_TYPE_BY_ID
} from "Actions/types";

// import functions from action
import {
    getReferralPayTypeDataSuccess,
    getReferralPayTypeDataFailure,
    addReferralPayTypeSuccess,
    addReferralPayTypeFailure,
    updateReferralPayTypeSuccess,
    updateReferralPayTypeFailure,
    activePayTypeSuccess,
    activePayTypeFailure,
    inactivePayTypeSuccess,
    inactivePayTypeFailure,
    getPayTypeByIdSuccess,
    getPayTypeByIdFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';

//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//Display referral PayType Data
function* getReferralPayTypeAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/ListReferralPayType', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getReferralPayTypeDataSuccess(response));
        } else {
            yield put(getReferralPayTypeDataFailure(response));
        }
    } catch (error) {
        yield put(getReferralPayTypeDataFailure(error));
    }
}

//Add referral PayType Data
function* addReferralPayTypeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/AddPayType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addReferralPayTypeSuccess(response));
        } else {
            yield put(addReferralPayTypeFailure(response));
        }
    } catch (error) {
        yield put(addReferralPayTypeFailure(error));
    }
}

//Edit/Update referral PayType Data
function* updateReferralPayTypeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/UpdateReferralPayType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(updateReferralPayTypeSuccess(response));
        } else {
            yield put(updateReferralPayTypeFailure(response));
        }
    } catch (error) {
        yield put(updateReferralPayTypeFailure(error));
    }
}

//Active PayType Data
function* activePayTypeDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/EnableReferralPayType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(activePayTypeSuccess(response));
        } else {
            yield put(activePayTypeFailure(response));
        }
    } catch (error) {
        yield put(activePayTypeFailure(error));
    }
}

//InActive PayType Data
function* inactivePayTypeDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/DisableReferralPayType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(inactivePayTypeSuccess(response));
        } else {
            yield put(inactivePayTypeFailure(response));
        }
    } catch (error) {
        yield put(inactivePayTypeFailure(error));
    }
}

//Get PayType Data By Id
function* getPayTypeDataByIdAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/GetReferralPayType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getPayTypeByIdSuccess(response));
        } else {
            yield put(getPayTypeByIdFailure(response));
        }
    } catch (error) {
        yield put(getPayTypeByIdFailure(error));
    }
}

function* getReferralPayType() {
    yield takeEvery(LIST_REFERRAL_PAY_TYPE, getReferralPayTypeAPI);
}

function* addReferralPayType() {
    yield takeEvery(ADD_REFERRAL_PAY_TYPE, addReferralPayTypeAPI);
}

function* UpdateReferralPayType() {
    yield takeEvery(UPDATE_REFERRAL_PAY_TYPE, updateReferralPayTypeAPI);
}

function* activePayTypeData() {
    yield takeEvery(ACTIVE_REFERRAL_PAY_TYPE, activePayTypeDataAPI);
}

function* inactivePayTypeData() {
    yield takeEvery(INACTIVE_REFERRAL_PAY_TYPE, inactivePayTypeDataAPI);
}

function* getPayTypeDataById() {
    yield takeEvery(GET_REFERRAL_PAY_TYPE_BY_ID, getPayTypeDataByIdAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getReferralPayType),
        fork(addReferralPayType),
        fork(UpdateReferralPayType),
        fork(activePayTypeData),
        fork(inactivePayTypeData),
        fork(getPayTypeDataById)
    ]);
}