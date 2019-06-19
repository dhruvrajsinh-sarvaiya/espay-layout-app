/**
 * Created By Sanjay
 * Created Date 12/02/2019
 * Saga File For Referral ChannelType
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    LIST_REFERRAL_CHANNEL_TYPE,
    ADD_REFERRAL_CHANNEL_TYPE,
    UPDATE_REFERRAL_CHANNEL_TYPE,
    ACTIVE_REFERRAL_CHANNEL_TYPE,
    INACTIVE_REFERRAL_CHANNEL_TYPE,
    GET_REFERRAL_CHANNEL_TYPE_BY_ID
} from "Actions/types";
// import functions from action
import {
    getReferralChannelTypeDataSuccess,
    getReferralChannelTypeDataFailure,
    addReferralChannelTypeSuccess,
    addReferralChannelTypeFailure,
    updateReferralChannelTypeSuccess,
    updateReferralChannelTypeFailure,
    activeChannelTypeSuccess,
    activeChannelTypeFailure,
    inactiveChannelTypeSuccess,
    inactiveChannelTypeFailure,
    getChannelTypeByIdSuccess,
    getChannelTypeByIdFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';

//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//Display referral ChannelType Data
function* getReferralChannelTypeAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/ListReferralChannelType', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getReferralChannelTypeDataSuccess(response));
        } else {
            yield put(getReferralChannelTypeDataFailure(response));
        }
    } catch (error) {
        yield put(getReferralChannelTypeDataFailure(error));
    }
}

//Add referral ChannelType Data
function* addReferralChannelTypeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/AddChannelType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addReferralChannelTypeSuccess(response));
        } else {
            yield put(addReferralChannelTypeFailure(response));
        }
    } catch (error) {
        yield put(addReferralChannelTypeFailure(error));
    }
}

//Edit/Update referral ChannelType Data
function* updateReferralChannelTypeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/UpdateReferralChannelType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(updateReferralChannelTypeSuccess(response));
        } else {
            yield put(updateReferralChannelTypeFailure(response));
        }
    } catch (error) {
        yield put(updateReferralChannelTypeFailure(error));
    }
}

//Active ChannelType Data
function* activeChannelTypeDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/EnableReferralChannelType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(activeChannelTypeSuccess(response));
        } else {
            yield put(activeChannelTypeFailure(response));
        }
    } catch (error) {
        yield put(activeChannelTypeFailure(error));
    }
}

//InActive ChannelType Data
function* inactiveChannelTypeDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/DisableReferralChannelType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(inactiveChannelTypeSuccess(response));
        } else {
            yield put(inactiveChannelTypeFailure(response));
        }
    } catch (error) {
        yield put(inactiveChannelTypeFailure(error));
    }
}

//Get ChannelType Data By Id
function* getChannelTypeDataByIdAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/GetReferralChannelType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getChannelTypeByIdSuccess(response));
        } else {
            yield put(getChannelTypeByIdFailure(response));
        }
    } catch (error) {
        yield put(getChannelTypeByIdFailure(error));
    }
}

function* getReferralChannelType() {
    yield takeEvery(LIST_REFERRAL_CHANNEL_TYPE, getReferralChannelTypeAPI);
}

function* addReferralChannelType() {
    yield takeEvery(ADD_REFERRAL_CHANNEL_TYPE, addReferralChannelTypeAPI);
}

function* UpdateReferralChannelType() {
    yield takeEvery(UPDATE_REFERRAL_CHANNEL_TYPE, updateReferralChannelTypeAPI);
}

function* activeChannelTypeData() {
    yield takeEvery(ACTIVE_REFERRAL_CHANNEL_TYPE, activeChannelTypeDataAPI);
}

function* inactiveChannelTypeData() {
    yield takeEvery(INACTIVE_REFERRAL_CHANNEL_TYPE, inactiveChannelTypeDataAPI);
}

function* getChannelTypeDataById() {
    yield takeEvery(GET_REFERRAL_CHANNEL_TYPE_BY_ID, getChannelTypeDataByIdAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getReferralChannelType),
        fork(addReferralChannelType),
        fork(UpdateReferralChannelType),
        fork(activeChannelTypeData),
        fork(inactiveChannelTypeData),
        fork(getChannelTypeDataById)
    ]);
}