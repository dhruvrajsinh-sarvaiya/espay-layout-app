/**
 * Author : Saloni Rathod
 * Created : 12/2/2019
 * Updated by: Saloni Rathod(07/03/2019), Bharat Jograna, 04 March 2019 
 * Display Affiliate saga
*/
import { all, fork, call, put, takeEvery } from "redux-saga/effects";
import {
    AFFILIATE_SIGNUP_REPORT,
    AFFILIATE_COMMISSION_REPORT,
    AFFILIATE_EMAIL_SENT_REPORT,
    AFFILIATE_SMS_SENT_REPORT,
    AFFILIATE_INVITE_FRIEND_CHART,
    AFFILIATE_ALL_USER,
    AFFILIATE_SCHEME_TYPE,
    AFFILIATE_MONTHLY_AVERAGE_COMMISSION_CHART,


    // Added By Bharat Jograna
    AFFILIATE_SHARE_ON_FACEBOOK_REPORT,
    AFFILIATE_SHARE_ON_TWITTER_REPORT,
    AFFILIATE_CLICK_ON_LINK_REPORT,
    AFFILIATE_ALL_COUNT,

} from "Actions/types";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

// import functions from action
import {
    //Added By Saloni Rathod
    affiliateSignupReportSuccess,
    affiliateSignupReportFailure,
    affiliateCommissionReportSuccess,
    affiliateCommissionReportFailure,
    affiliateEmailSentReportSuccess,
    affiliateEmailSentReportFailure,
    affiliateSmsSentReportSuccess,
    affiliateSmsSentReportFailure,
    affiliateAllUserSuccess,
    affiliateAllUserFailure,
    affiliateSchemeTypeSuccess,
    affiliateSchemeTypeFailure,
    affiliateInviteFriendChartSuccess,
    affiliateInviteFriendChartFailure,
    affiliateMonthlyAverageCommissionChartSuccess,
    affiliateMonthlyAverageCommissionChartFailure,

    // Added By Bharat Jograna
    affiliateShareOnFacebookReportSuccess,
    affiliateShareOnFacebookReportFailure,
    affiliateShareOnTwitterReportSuccess,
    affiliateShareOnTwitterReportFailure,
    affiliateClickOnLinkReportSuccess,
    affiliateClickOnLinkReportFailure,
    affiliateAllCountSuccess,
    affiliateAllCountFailure,

} from "Actions/MyAccount";

//Added By Saloni Rathod
//Display Affiliate Signup report API
function* affiliateSignupReportApi({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/GetAffiateUserRegistered', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(affiliateSignupReportSuccess(response));
        } else {
            yield put(affiliateSignupReportFailure(response));
        }
    } catch (error) {
        yield put(affiliateSignupReportFailure(error));
    }
}

//Display Affiliate Commission report API
function* affiliateCommissionReportApi({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var swaggerUrl = 'api/AffiliateBackOffice/AffiliateCommissionHistoryReport/' + payload.PageNo + '/' + payload.PageSize;

    if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
        swaggerUrl += '?FromDate=' + payload.FromDate;
    }
    if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
        swaggerUrl += '&ToDate=' + payload.ToDate;
    }
    if (payload.hasOwnProperty("TrnUserId") && payload.TrnUserId !== "") {
        swaggerUrl += '&TrnUserId=' + payload.TrnUserId;
    }
    if (payload.hasOwnProperty("AffiliateUserId") && payload.AffiliateUserId !== "") {
        swaggerUrl += '&AffiliateUserId=' + payload.AffiliateUserId;
    }
    if (payload.hasOwnProperty("SchemeMappingId") && payload.SchemeMappingId !== "") {
        swaggerUrl += '&SchemeMappingId=' + payload.SchemeMappingId;
    }
    if (payload.hasOwnProperty("TrnRefNo") && payload.TrnRefNo !== "") {
        swaggerUrl += '&TrnRefNo=' + payload.TrnRefNo;
    }
    const Response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        if (Response.ReturnCode === 0) {
            yield put(affiliateCommissionReportSuccess(Response));
        } else {
            yield put(affiliateCommissionReportFailure(Response));
        }
    } catch (error) {
        yield put(affiliateCommissionReportFailure(error));
    }
}


//Display Affiliate Email Sent report
function* affiliateEmailSentReportApi({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/GetEmailSent', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(affiliateEmailSentReportSuccess(response));
        } else {
            yield put(affiliateEmailSentReportFailure(response));
        }
    } catch (error) {
        yield put(affiliateEmailSentReportFailure(error));
    }
}
//Display Affiliate Sms Sent report
function* affiliateSmsSentReportApi({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/GetSMSSent', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(affiliateSmsSentReportSuccess(response));
        } else {
            yield put(affiliateSmsSentReportFailure(response));
        }
    } catch (error) {
        yield put(affiliateSmsSentReportFailure(error));
    }
}
//Display Affiliate  all user  report
function* affiliateAllUserReportApi({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/AffiliateBackOffice/GetAllAffiliateUser', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(affiliateAllUserSuccess(response));
        } else {
            yield put(affiliateAllUserFailure(response));
        }
    } catch (error) {
        yield put(affiliateAllUserFailure(error));
    }
}
//Display Affiliate  all user  report
function* affiliateSchemeTypeReportApi({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/Affiliate/GetAffiliateSchemeType/0', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(affiliateSchemeTypeSuccess(response));
        } else {
            yield put(affiliateSchemeTypeFailure(response));
        }
    } catch (error) {
        yield put(affiliateSchemeTypeFailure(error));
    }
}

//Display Affiliate Commission report API
function* affiliateShareOnFacebookReportApi({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/GetFacebookLinkClick', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(affiliateShareOnFacebookReportSuccess(response));
        } else {
            yield put(affiliateShareOnFacebookReportFailure(response));
        }
    } catch (error) {
        yield put(affiliateShareOnFacebookReportFailure(error));
    }
}

//Display Affiliate Commission report API
function* affiliateShareOnTwitterReportApi({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/GetTwitterLinkClick', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(affiliateShareOnTwitterReportSuccess(response));
        } else {
            yield put(affiliateShareOnTwitterReportFailure(response));
        }
    } catch (error) {
        yield put(affiliateShareOnTwitterReportFailure(error));
    }
}

//Display Affiliate Commission report API
function* affiliateClickOnLinkReportApi({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/GetReferralLinkClick', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(affiliateClickOnLinkReportSuccess(response));
        } else {
            yield put(affiliateClickOnLinkReportFailure(response));
        }
    } catch (error) {
        yield put(affiliateClickOnLinkReportFailure(error));
    }
}

//Display Affiliate All Count report
function* affiliateAllCountReportApi() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/AffiliateBackOffice/GetAffiliateDashboardCount', {}, headers);
    
    try {
        if (response.ReturnCode === 0) {
            yield put(affiliateAllCountSuccess(response));
        } else {
            yield put(affiliateAllCountFailure(response));
        }
    } catch (error) {
        yield put(affiliateAllCountFailure(error));
    }
}

//Display Affiliate monthly commission by type chart
function* affiliateMonthlyAverageCommissionChartApi({payload}) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/AffiliateBackOffice/GetMonthWiseCommissionChartDetail?Year='+ payload, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(affiliateMonthlyAverageCommissionChartSuccess(response));
        } else {
            yield put(affiliateMonthlyAverageCommissionChartFailure(response));
        }
    } catch (error) {
        yield put(affiliateMonthlyAverageCommissionChartFailure(error));
    }
}
//Display Affiliate invite friend chart
function* affiliateInviteFriendChartApi() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/AffiliateBackOffice/GetAffiliateInvitieChartDetail', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(affiliateInviteFriendChartSuccess(response));
        } else {
            yield put(affiliateInviteFriendChartFailure(response));
        }
    } catch (error) {
        yield put(affiliateInviteFriendChartFailure(error));
    }
}


//Display Affiliate Signup report
function* affiliateSignupReportSaga() {
    yield takeEvery(AFFILIATE_SIGNUP_REPORT, affiliateSignupReportApi);
}

//Display Affiliate Commission report
function* AffiliateCommissionReportSaga() {
    yield takeEvery(AFFILIATE_COMMISSION_REPORT, affiliateCommissionReportApi);
}


//Display Affiliate email sentreport
function* affiliateEmailSentReportSaga() {
    yield takeEvery(AFFILIATE_EMAIL_SENT_REPORT, affiliateEmailSentReportApi);
}

//Display Affiliate sms sent report
function* affiliateSmsSentReportSaga() {
    yield takeEvery(AFFILIATE_SMS_SENT_REPORT, affiliateSmsSentReportApi);
}
//Display Affiliate all user report
function* affiliateAllUserReportSaga() {
    yield takeEvery(AFFILIATE_ALL_USER, affiliateAllUserReportApi);
}
//Display Affiliate all user report
function* affiliateSchemeTypeReportSaga() {
    yield takeEvery(AFFILIATE_SCHEME_TYPE, affiliateSchemeTypeReportApi);
}

//Display Affiliate Share On Facebook report
function* affiliateShareOnFacebookReportSaga() {
    yield takeEvery(AFFILIATE_SHARE_ON_FACEBOOK_REPORT, affiliateShareOnFacebookReportApi);
}

//Display Affiliate Share On Twitter report
function* affiliateShareOnTwitterReportSaga() {
    yield takeEvery(AFFILIATE_SHARE_ON_TWITTER_REPORT, affiliateShareOnTwitterReportApi);
}

//Display Affiliate Click On Link report
function* affiliateClickOnLinkReportSaga() {
    yield takeEvery(AFFILIATE_CLICK_ON_LINK_REPORT, affiliateClickOnLinkReportApi);
}

//Display Affiliate all count
function* affiliateAllCountReportSaga() {
    yield takeEvery(AFFILIATE_ALL_COUNT, affiliateAllCountReportApi);
}

//Display Affiliate monthly average chart
function* affiliateMonthlyAverageCommissionChartSaga() {
    yield takeEvery(AFFILIATE_MONTHLY_AVERAGE_COMMISSION_CHART, affiliateMonthlyAverageCommissionChartApi);
}

//Display Affiliate invite friend chart
function* affiliateInviteFriendChartSaga() {
    yield takeEvery(AFFILIATE_INVITE_FRIEND_CHART, affiliateInviteFriendChartApi);
}

export default function* rootSaga() {
    yield all([
        fork(affiliateSignupReportSaga),
         fork(AffiliateCommissionReportSaga),
        fork(affiliateEmailSentReportSaga),
        fork(affiliateSmsSentReportSaga),
        fork(affiliateAllUserReportSaga),
        fork(affiliateSchemeTypeReportSaga),
        fork(affiliateMonthlyAverageCommissionChartSaga),
        fork(affiliateInviteFriendChartSaga),
        // Added by Bharat Jograna 
        fork(affiliateShareOnFacebookReportSaga),
        fork(affiliateShareOnTwitterReportSaga),
        fork(affiliateClickOnLinkReportSaga),
        fork(affiliateAllCountReportSaga),
    ]);
}