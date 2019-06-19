/*
    Developer : Bharat Jograna
    Date : 11-02-2019
    File Comment : MyAccount ReferralReport Dashboard saga
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { REFERRAL_SIGNUP_REPORT, REFERRAL_BUY_TRADE_REPORT, REFERRAL_SELL_TRADE_REPORT, REFERRAL_DEPOSIT_REPORT, REFERRAL_SEND_EMAIL_REPORT, REFERRAL_SEND_SMS_REPORT, REFERRAL_SHARE_ON_FACEBOOK_REPORT, REFERRAL_SHARE_ON_TWITTER_REPORT, REFERRAL_CLICK_ON_REFERRAL_LINK_REPORT } from "Actions/types";
// import functions from action
import {
    signupReportSuccess, signupReportFailure, buyTradeReportSuccess, buyTradeReportFailure, sellTradeReportSuccess, sellTradeReportFailure, depositReportSuccess, depositReportFailure, sendEmailReportSuccess, sendEmailReportFailure, sendSMSReportSuccess, sendSMSReportFailure, shareOnFacebookReportSuccess, shareOnFacebookReportFailure, shareOnTwitterReportSuccess, shareOnTwitterReportFailure, clickOnReferralLinkReportSuccess, clickOnReferralLinkReportFailure,
} from "Actions/MyAccount";
import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI } from 'Helpers/helpers';

import Datasaga from '../../components/MyAccount/Dashboards/ComponentSataticData';


const response = {
    "referral":
        [
            {
                "Id": 58,
                "refereeuser": "Kartik",
                "slab": "1",
                "username": "bharat",
                "currency": "0.2943",
                "commrate": "1.021548",
                "pair": "ATCC_BTC",
                "totalvol": "0.987163",
                "chargecoll": "9.152456325",
                "address": "",
                "commearn": 1,
                "Createddate": "2019-02-08T05:56:47.3095165"
            },
            {
                "Id": 57,
                "refereeuser": "tejas",
                "slab": "1",
                "username": "bharat",
                "currency": "0.2943",
                "commrate": "1.021548",
                "pair": "ATCC_BTC",
                "totalvol": "0.987163",
                "chargecoll": "8.401996373",
                "address": "",
                "commearn": 1,
                "Createddate": "2019-01-31T11:35:45.4160353"
            },
            {
                "Id": 56,
                "refereeuser": "John",
                "slab": "1",
                "username": "bharat",
                "currency": "0.2943",
                "commrate": "1.021548",
                "pair": "ATCC_BTC",
                "totalvol": "0.987163",
                "chargecoll": "9.898989001",
                "address": "",
                "commearn": 4, "Createddate": "2019-01-24T13:54:36.6431853"
            }],
    "TotalCount": 3,
    "ReturnCode": 0,
    "ReturnMsg": "Successfully get Referral Report filter data.",
    "ErrorCode": 0,
    "statusCode": 200
}


//Function for Buy Trade Report Configuration API
function* buyTradeReportAPI({ payload }) {
    // var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerPostAPI, '/api/Manage/changepassword', payload, headers);
    try {
        if (response.statusCode === 200) {
            yield put(buyTradeReportSuccess(response));
        } else {
            yield put(buyTradeReportFailure(response));
        }
    } catch (error) {
        yield put(buyTradeReportFailure(error));
    }
}
/* Create Sagas method for Buy Trade Report Configuration */
export function* buyTradeReport() {
    yield takeEvery(REFERRAL_BUY_TRADE_REPORT, buyTradeReportAPI);
}


//Function for Signup Report Configuration API
function* signupReportAPI({ payload }) {
    // var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerPostAPI, '/api/Manage/changepassword', payload, headers);
    try {
        if (response.statusCode === 200) {
            yield put(signupReportSuccess(response));
        } else {
            yield put(signupReportFailure(response));
        }
    } catch (error) {
        yield put(signupReportFailure(error));
    }
}
/* Create Sagas method for Signup Report Configuration */
export function* signupReport() {
    yield takeEvery(REFERRAL_SIGNUP_REPORT, signupReportAPI);
}


//Function for Sell Trade Report Configuration API
function* sellTradeReportAPI({ payload }) {
    // var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerPostAPI, '/api/Manage/changepassword', payload, headers);
    try {
        if (response.statusCode === 200) {
            yield put(sellTradeReportSuccess(response));
        } else {
            yield put(sellTradeReportFailure(response));
        }
    } catch (error) {
        yield put(sellTradeReportFailure(error));
    }
}
/* Create Sagas method for Sell Trade Report Configuration */
export function* sellTradeReport() {
    yield takeEvery(REFERRAL_SELL_TRADE_REPORT, sellTradeReportAPI);
}


//Function for Deposit Report Configuration API
function* depositeReportAPI({ payload }) {
    // var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerPostAPI, '/api/Manage/changepassword', payload, headers);
    try {
        if (response.statusCode === 200) {
            yield put(depositReportSuccess(response));
        } else {
            yield put(depositReportFailure(response));
        }
    } catch (error) {
        yield put(depositReportFailure(error));
    }
}
/* Create Sagas method for Deposit Report Configuration */
export function* depositReport() {
    yield takeEvery(REFERRAL_DEPOSIT_REPORT, depositeReportAPI);
}



//Function for sendEmailReport Configuration API
function* sendEmailReportAPI({ payload }) {
    // var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerPostAPI, '/api/Manage/changepassword', payload, headers);
    try {
        if (Datasaga.statusCode === 200) {
            yield put(sendEmailReportSuccess(Datasaga));
        } else {
            yield put(sendEmailReportFailure(Datasaga));
        }
    } catch (error) {
        yield put(sendEmailReportFailure(error));
    }
}
/* Create Sagas method for sendEmailReport Configuration */
export function* sendEmailReport() {
    yield takeEvery(REFERRAL_SEND_EMAIL_REPORT, sendEmailReportAPI);
}


//Function for Send SMS Report Configuration API
function* sendSMSReportAPI({ payload }) {
    // var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerPostAPI, '/api/Manage/changepassword', payload, headers);
    try {
        if (Datasaga.statusCode === 200) {
            yield put(sendSMSReportSuccess(Datasaga));
        } else {
            yield put(sendSMSReportFailure(Datasaga));
        }
    } catch (error) {
        yield put(sendSMSReportFailure(error));
    }
}
/* Create Sagas method for Send SMS Report Configuration */
export function* sendSMSReport() {
    yield takeEvery(REFERRAL_SEND_SMS_REPORT, sendSMSReportAPI);
}


//Function for Share On Facebook Report Configuration API
function* shareOnFacebookReportAPI({ payload }) {
    // var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerPostAPI, '/api/Manage/changepassword', payload, headers);
    try {
        if (Datasaga.statusCode === 200) {
            yield put(shareOnFacebookReportSuccess(Datasaga));
        } else {
            yield put(shareOnFacebookReportFailure(Datasaga));
        }
    } catch (error) {
        yield put(shareOnFacebookReportFailure(error));
    }
}
/* Create Sagas method for Share On Facebook Report Configuration */
export function* shareOnFacebookReport() {
    yield takeEvery(REFERRAL_SHARE_ON_FACEBOOK_REPORT, shareOnFacebookReportAPI);
}



//Function for Share On Twitter Report Configuration API
function* shareOnTwitterReportAPI({ payload }) {
    // var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerPostAPI, '/api/Manage/changepassword', payload, headers);
    try {
        if (Datasaga.statusCode === 200) {
            yield put(shareOnTwitterReportSuccess(Datasaga));
        } else {
            yield put(shareOnTwitterReportFailure(Datasaga));
        }
    } catch (error) {
        yield put(shareOnTwitterReportFailure(error));
    }
}
/* Create Sagas method for Share On Twitter Report Configuration */
export function* shareOnTwitterReport() {
    yield takeEvery(REFERRAL_SHARE_ON_TWITTER_REPORT, shareOnTwitterReportAPI);
}



//Function for Click On Referral Link Report Configuration API
function* clickOnReferralLinkReportAPI({ payload }) {
    // var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerPostAPI, '/api/Manage/changepassword', payload, headers);
    try {
        if (Datasaga.statusCode === 200) {
            yield put(clickOnReferralLinkReportSuccess(Datasaga));
        } else {
            yield put(clickOnReferralLinkReportFailure(Datasaga));
        }
    } catch (error) {
        yield put(clickOnReferralLinkReportFailure(error));
    }
}
/* Create Sagas method for Click On Referral Link Report Configuration */
export function* clickOnReferralLinkReport() {
    yield takeEvery(REFERRAL_CLICK_ON_REFERRAL_LINK_REPORT, clickOnReferralLinkReportAPI);
}

export default function* rootSaga() {
    yield all([
        fork(signupReport),
        fork(buyTradeReport),
        fork(sellTradeReport),
        fork(depositReport),
        fork(sendEmailReport),
        fork(sendSMSReport),
        fork(shareOnFacebookReport),
        fork(shareOnTwitterReport),
        fork(clickOnReferralLinkReport),
    ]);
}
