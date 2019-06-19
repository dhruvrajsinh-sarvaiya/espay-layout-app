/**
 * Created By Sanjay
 * Created Date 12/02/19
 * Saga File for Referral Invitation
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import {
    GET_REFERRAL_INVITE_LIST,
    GET_REFERRAL_INVITE_BY_CHANNEL,
    GET_REFERRAL_PARTICIPATE_LIST,
    CLICK_REFERRAL_LINK_REPORT,
    REFERRAL_REWARD_REPORT,
    GET_CHANNEL_TYPE,
    GET_SERVICE_LIST
} from "Actions/types";

// import functions from action
import {
    getReferralInviteListSuccess,
    getReferralInviteListFailure,
    getReferralInviteByChannelSuccess,
    getReferralInviteByChannelFailure,
    getReferralParticipateSuccess,
    getReferralParticipateFailure,
    clickReferralLinkReportSuccess,
    clickReferralLinkReportFailure,
    referralRewardReportSuccess,
    referralRewardReportFailure,
    getChannelTypeSuccess,
    getChannelTypeFailure,
    getServiceListSuccess,
    getServiceListFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';

//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//Display referral Invitation Data
function* getReferralInviteListAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/Referral/ListAdminReferralChannelInvite?PageIndex=' + payload.PageIndex + "&Page_Size=" + payload.Page_Size;
    if (payload.hasOwnProperty("Username") && payload.Username !== "") {
        URL += '&Username=' + payload.Username;
    }
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

//Display referral Invite Data By Channel
function* getReferralInviteByChannelAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/Referral/ListAdminReferralChannelWithChannelType?ReferralChannelTypeId=' + payload.channelId + '&PageIndex=' + payload.PageIndex + "&Page_Size=" + payload.Page_Size;
    if (payload.hasOwnProperty("Username") && payload.Username !== "") {
        URL += '&Username=' + payload.Username;
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
            yield put(getReferralInviteByChannelSuccess(response));
        } else {
            yield put(getReferralInviteListFailure(response));
        }
    } catch (error) {
        yield put(getReferralInviteByChannelFailure(error));
    }
}

//Display referral Participate Data By Channel
function* getReferralParticipateAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/Referral/ListAdminParticipateReferralUser?&PageIndex=' + payload.PageIndex + "&Page_Size=" + payload.Page_Size;
    if (payload.hasOwnProperty("Username") && payload.Username !== "") {
        URL += '&Username=' + payload.Username;
    }
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

//Display referral click link Data
function* clickReferralLinkDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/Referral/ListAdminReferralUserClick?PageIndex=' + payload.PageIndex + "&Page_Size=" + payload.Page_Size;
    if (payload.hasOwnProperty("Username") && payload.Username !== "") {
        URL += '&Username=' + payload.Username;
    }
    if (payload.hasOwnProperty("ChannelType") && payload.ChannelType !== "") {
        URL += '&ReferralChannelTypeId=' + payload.ChannelType;
    }
    if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
        URL += '&FromDate=' + payload.FromDate;
    }
    if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
        URL += '&ToDate=' + payload.ToDate;
    }
    if (payload.hasOwnProperty("Service") && payload.Service !== "") {
        URL += '&ReferralServiceId=' + payload.Service;
    }
    const response = yield call(swaggerPostAPI, URL, payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(clickReferralLinkReportSuccess(response));
        } else {
            yield put(clickReferralLinkReportFailure(response));
        }
    } catch (error) {
        yield put(clickReferralLinkReportFailure(error));
    }
}

//Display referral reward Data
function* referralRewardReportDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/Referral/ListAdminReferralRewards?PageIndex=' + payload.PageIndex + "&Page_Size=" + payload.Page_Size;
    if (payload.hasOwnProperty("Username") && payload.Username !== "") {
        URL += '&Username=' + payload.Username;
    }
    if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
        URL += '&FromDate=' + payload.FromDate;
    }
    if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
        URL += '&ToDate=' + payload.ToDate;
    }
    if (payload.hasOwnProperty("Service") && payload.Service !== "") {
        URL += '&ReferralServiceId=' + payload.Service;
    }
    const response = yield call(swaggerPostAPI, URL, payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(referralRewardReportSuccess(response));
        } else {
            yield put(referralRewardReportFailure(response));
        }
    } catch (error) {
        yield put(referralRewardReportFailure(error));
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

function* getReferralInvite() {
    yield takeEvery(GET_REFERRAL_INVITE_LIST, getReferralInviteListAPI);
}

function* getReferralInviteByChannel() {
    yield takeEvery(GET_REFERRAL_INVITE_BY_CHANNEL, getReferralInviteByChannelAPI);
}

function* getReferralParticipate() {
    yield takeEvery(GET_REFERRAL_PARTICIPATE_LIST, getReferralParticipateAPI);
}

function* clickReferralLinkData() {
    yield takeEvery(CLICK_REFERRAL_LINK_REPORT, clickReferralLinkDataAPI);
}

function* referralRewardReportData() {
    yield takeEvery(REFERRAL_REWARD_REPORT, referralRewardReportDataAPI);
}

function* getChannelTypeData() {
    yield takeEvery(GET_CHANNEL_TYPE, getChannelTypeDataAPI);
}

function* getServiceData() {
    yield takeEvery(GET_SERVICE_LIST, getServiceDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getReferralInvite),
        fork(getReferralInviteByChannel),
        fork(getReferralParticipate),
        fork(getChannelTypeData),
        fork(getServiceData),
        fork(clickReferralLinkData),
        fork(referralRewardReportData)
    ]);
}