/**
 * Create By Sanjay 
 * Created Date 25/02/2019
 * Saga file fro Referral Program
 */

import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import {
    GET_REFERRAL_CODE,
    GET_REFERRAL_URL,
    GET_COUNT_REFERRAL_DASHBOARD,
    GET_REFERRAL_INVITE_LIST,
    GET_CHANNEL_TYPE,
    GET_SERVICE_LIST,
    GET_PAY_TYPE,
    GET_REFERRAL_PARTICIPATE_LIST,
    GET_REFERRAL_INVITE_BY_CHANNEL
} from 'Actions/types';

import {
    getReferralCodeSuccess,
    getReferralCodeFailure,
    getCountReferralDashboardSuccess,
    getCountReferralDashboardFailure,
    getReferralInviteListSuccess,
    getReferralInviteListFailure,
    getChannelTypeSuccess,
    getChannelTypeFailure,
    getServiceListSuccess,
    getServiceListFailure,
    getPayTypeSuccess,
    getPayTypeFailure,
    getReferralParticipateSuccess,
    getReferralParticipateFailure,
    getReferralInviteByChannelSuccess,
    getReferralInviteByChannelFailure,
    getReferralURLSuccess,
    getReferralURLFailure
} from 'Actions/MyAccount';

//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';

//Function For Get Referral Code
function* getReferralCodeDataAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/GetUserReferralCode', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getReferralCodeSuccess(response));
        } else {
            yield put(getReferralCodeFailure(response));
        }
    } catch (error) {
        yield put(getReferralCodeFailure(error));
    }
}

//Function for Normal Register
function* getReferralUrlDataAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/GetReferralURL', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getReferralURLSuccess(response));
        } else {
            yield put(getReferralURLFailure(response));
        }
    } catch (error) {
        yield put(getReferralURLFailure(error));
    }
}

//Display Referral Count 
function* getCountReferralDashboardAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/AllCountForUserReferralChannel', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getCountReferralDashboardSuccess(response));
        } else {
            yield put(getCountReferralDashboardFailure(response));
        }
    } catch (error) {
        yield put(getCountReferralDashboardFailure(error));
    }
}

//Display referral Invitation Data
function* getReferralInviteListAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/Referral/ListUserReferralChannelInvite?PageIndex=' + payload.PageIndex + "&Page_Size=" + payload.Page_Size;
    if (payload.hasOwnProperty("ChannelType") && payload.ChannelType !== "") {
        URL += '&ReferralChannelTypeId=' + payload.ChannelType;
    }
    if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
        URL += '&FromDate=' + payload.FromDate;
    }
    if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
        URL += '&ToDate=' + payload.ToDate;
    }
    if (payload.hasOwnProperty("PayType") && payload.PayType !== "") {
        URL += '&ReferralPayTypeId=' + payload.PayType;
    }
    if (payload.hasOwnProperty("Service") && payload.Service !== "") {
        URL += '&ReferralServiceId=' + payload.Service;
    }
    const response = yield call(swaggerPostAPI, URL, payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getReferralInviteListSuccess(response));
        } else {
            yield put(getReferralInviteListFailure(response));
        }
    } catch (error) {
        yield put(getReferralInviteListFailure(error));
    }
}

//Display referral Channel Type Data
function* getChannelTypeDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/DropDownReferralChannelType/', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getChannelTypeSuccess(response));
        } else {
            yield put(getChannelTypeFailure(response));
        }
    } catch (error) {
        yield put(getChannelTypeFailure(error));
    }
}

//Display referral Service Data
function* getServiceDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/DropDownReferralService?PayTypeId=' + payload.PayTypeId, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getServiceListSuccess(response));
        } else {
            yield put(getServiceListFailure(response));
        }
    } catch (error) {
        yield put(getServiceListFailure(error));
    }
}

//For Get Pay Type Data from API
function* getPayTypeDataAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/DropDownReferralPayType', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getPayTypeSuccess(response));
        } else {
            yield put(getPayTypeFailure(response));
        }
    } catch (error) {
        yield put(getPayTypeFailure(error));
    }
}

//Display referral Participate Data By Channel
function* getReferralParticipateAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/Referral/ListUserParticipateReferralUser?&PageIndex=' + payload.PageIndex + "&Page_Size=" + payload.Page_Size;
    if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
        URL += '&FromDate=' + payload.FromDate;
    }
    if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
        URL += '&ToDate=' + payload.ToDate;
    }
    if (payload.hasOwnProperty("ChannelType") && payload.ChannelType !== "") {
        URL += '&ReferralChannelTypeId=' + payload.ChannelType;
    }
    if (payload.hasOwnProperty("Service") && payload.Service !== "") {
        URL += '&ReferralServiceId=' + payload.Service;
    }
    if (payload.hasOwnProperty("ReferUsername") && payload.ReferUsername !== "") {
        URL += '&ReferUserName=' + payload.ReferUsername;
    }
    const response = yield call(swaggerPostAPI, URL, payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getReferralParticipateSuccess(response));
        } else {
            yield put(getReferralParticipateFailure(response));
        }
    } catch (error) {
        yield put(getReferralParticipateFailure(error));
    }
}

//Display referral Invite Data By Channel
function* getReferralInviteByChannelAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/Referral/ListUserReferralChannelWithChannelType?ReferralChannelTypeId=' + payload.channelId + '&PageIndex=' + payload.PageIndex + "&Page_Size=" + payload.Page_Size;
    if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
        URL += '&FromDate=' + payload.FromDate;
    }
    if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
        URL += '&ToDate=' + payload.ToDate;
    }
    if (payload.hasOwnProperty("PayType") && payload.PayType !== "") {
        URL += '&ReferralPayTypeId=' + payload.PayType;
    }
    if (payload.hasOwnProperty("Service") && payload.Service !== "") {
        URL += '&ReferralServiceId=' + payload.Service;
    }
    const response = yield call(swaggerPostAPI, URL, payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getReferralInviteByChannelSuccess(response));
        } else {
            yield put(getReferralInviteListFailure(response));
        }
    } catch (error) {
        yield put(getReferralInviteByChannelFailure(error));
    }
}

function* getCountReferralDashboard() {
    yield takeEvery(GET_COUNT_REFERRAL_DASHBOARD, getCountReferralDashboardAPI);
}

export function* getReferralCodeData() {
    yield takeEvery(GET_REFERRAL_CODE, getReferralCodeDataAPI);
}

export function* getReferralUrlData() {
    yield takeEvery(GET_REFERRAL_URL, getReferralUrlDataAPI);
}

function* getReferralInvite() {
    yield takeEvery(GET_REFERRAL_INVITE_LIST, getReferralInviteListAPI);
}

function* getChannelTypeData() {
    yield takeEvery(GET_CHANNEL_TYPE, getChannelTypeDataAPI);
}

function* getServiceData() {
    yield takeEvery(GET_SERVICE_LIST, getServiceDataAPI);
}

function* getPayTypeData() {
    yield takeEvery(GET_PAY_TYPE, getPayTypeDataAPI);
}

function* getReferralParticipate() {
    yield takeEvery(GET_REFERRAL_PARTICIPATE_LIST, getReferralParticipateAPI);
}

function* getReferralInviteByChannel() {
    yield takeEvery(GET_REFERRAL_INVITE_BY_CHANNEL, getReferralInviteByChannelAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getReferralCodeData),
        fork(getCountReferralDashboard),
        fork(getReferralInvite),
        fork(getChannelTypeData),
        fork(getServiceData),
        fork(getPayTypeData),
        fork(getReferralParticipate),
        fork(getReferralInviteByChannel),
        fork(getReferralUrlData)
    ]);
}