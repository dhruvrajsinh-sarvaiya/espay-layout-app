/**
 * Created By Sanjay
 * Created Date 13/02/2019
 * Saga File For Referral ServiceType
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    LIST_REFERRAL_SERVICE_TYPE,
    ADD_REFERRAL_SERVICE_TYPE,
    UPDATE_REFERRAL_SERVICE_TYPE,
    ACTIVE_REFERRAL_SERVICE_TYPE,
    INACTIVE_REFERRAL_SERVICE_TYPE,
    GET_REFERRAL_SERVICE_TYPE_BY_ID
} from "Actions/types";

// import functions from action
import {
    getReferralServiceTypeDataSuccess,
    getReferralServiceTypeDataFailure,
    addReferralServiceTypeSuccess,
    addReferralServiceTypeFailure,
    updateReferralServiceTypeSuccess,
    updateReferralServiceTypeFailure,
    activeServiceTypeSuccess,
    activeServiceTypeFailure,
    inactiveServiceTypeSuccess,
    inactiveServiceTypeFailure,
    getServiceTypeByIdSuccess,
    getServiceTypeByIdFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';

//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//Display referral ServiceType Data
function* getReferralServiceTypeAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/ListReferralServiceType', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getReferralServiceTypeDataSuccess(response));
        } else {
            yield put(getReferralServiceTypeDataFailure(response));
        }
    } catch (error) {
        yield put(getReferralServiceTypeDataFailure(error));
    }
}

//Add referral ServiceType Data
function* addReferralServiceTypeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/AddServiceType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addReferralServiceTypeSuccess(response));
        } else {
            yield put(addReferralServiceTypeFailure(response));
        }
    } catch (error) {
        yield put(addReferralServiceTypeFailure(error));
    }
}

//Edit/Update referral ServiceType Data
function* updateReferralServiceTypeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/UpdateReferralServiceType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(updateReferralServiceTypeSuccess(response));
        } else {
            yield put(updateReferralServiceTypeFailure(response));
        }
    } catch (error) {
        yield put(updateReferralServiceTypeFailure(error));
    }
}

//Active ServiceType Data
function* activeServiceTypeDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/EnableReferralServiceType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(activeServiceTypeSuccess(response));
        } else {
            yield put(activeServiceTypeFailure(response));
        }
    } catch (error) {
        yield put(activeServiceTypeFailure(error));
    }
}

//InActive ServiceType Data
function* inactiveServiceTypeDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/DisableReferralServiceType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(inactiveServiceTypeSuccess(response));
        } else {
            yield put(inactiveServiceTypeFailure(response));
        }
    } catch (error) {
        yield put(inactiveServiceTypeFailure(error));
    }
}

//Get ServiceType Data By Id
function* getServiceTypeDataByIdAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/GetReferralServiceType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getServiceTypeByIdSuccess(response));
        } else {
            yield put(getServiceTypeByIdFailure(response));
        }
    } catch (error) {
        yield put(getServiceTypeByIdFailure(error));
    }
}

function* activeServiceTypeData() {
    yield takeEvery(ACTIVE_REFERRAL_SERVICE_TYPE, activeServiceTypeDataAPI);
}

function* inactiveServiceTypeData() {
    yield takeEvery(INACTIVE_REFERRAL_SERVICE_TYPE, inactiveServiceTypeDataAPI);
}

function* getReferralServiceType() {
    yield takeEvery(LIST_REFERRAL_SERVICE_TYPE, getReferralServiceTypeAPI);
}

function* addReferralServiceType() {
    yield takeEvery(ADD_REFERRAL_SERVICE_TYPE, addReferralServiceTypeAPI);
}

function* UpdateReferralServiceType() {
    yield takeEvery(UPDATE_REFERRAL_SERVICE_TYPE, updateReferralServiceTypeAPI);
}

function* getServiceTypeDataById() {
    yield takeEvery(GET_REFERRAL_SERVICE_TYPE_BY_ID, getServiceTypeDataByIdAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getReferralServiceType),
        fork(addReferralServiceType),
        fork(UpdateReferralServiceType),
        fork(activeServiceTypeData),
        fork(inactiveServiceTypeData),
        fork(getServiceTypeDataById)
    ]);
}