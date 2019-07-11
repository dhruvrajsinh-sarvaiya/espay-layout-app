/**
 * Create By Sanjay 
 * Created Date 06/03/2019
 * Saga For Referral Report 
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import {
    CLICK_REFERRAL_LINK_REPORT,
    REFERRAL_REWARD_REPORT,
    GET_REFERRAL_SERVICE
} from "Actions/types";

// import functions from action
import {
    clickReferralLinkReportSuccess,
    clickReferralLinkReportFailure,
    referralRewardReportSuccess,
    referralRewardReportFailure,
    getReferralServiceSuccess,
    getReferralServiceFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';

//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//Display referral click link Data
function* clickReferralLinkDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/Referral/ListUserReferralUserClick?PageIndex=' + payload.PageIndex + "&Page_Size=" + payload.Page_Size;
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
    var URL = 'api/Referral/ListUserReferralRewards?PageIndex=' + payload.PageIndex + "&Page_Size=" + payload.Page_Size;
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

//Display referral reward Data
function* referralServiceDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }    
    const response = yield call(swaggerPostAPI, "api/Referral/GetReferralService", {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getReferralServiceSuccess(response));
        } else {
            yield put(getReferralServiceFailure(response));
        }
    } catch (error) {
        yield put(getReferralServiceFailure(error));
    }
}

function* clickReferralLinkData() {
    yield takeEvery(CLICK_REFERRAL_LINK_REPORT, clickReferralLinkDataAPI);
}

function* referralRewardReportData() {
    yield takeEvery(REFERRAL_REWARD_REPORT, referralRewardReportDataAPI);
}

function* referralServiceData() {
    yield takeEvery(GET_REFERRAL_SERVICE, referralServiceDataAPI);
}

export default function* rootSaga() {
    yield all([       
        fork(clickReferralLinkData),
        fork(referralRewardReportData),
        fork(referralServiceData)
    ]);
}