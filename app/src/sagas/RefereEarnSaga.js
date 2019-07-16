import {
    put, call, takeLatest, select
} from 'redux-saga/effects';
import {
    GET_ENSTIMATED_COMMISSION,
    GET_REFERRAL_CHANNEL_USER_COUNT,
    GET_REFERRAL_URL,
    GET_REFERRAL_SERVICE_DESCRIPTION,
    GET_REFERRAL_CODE,
    REFERRAL_EMAIL_SEND,
    REFERRAL_SMS_SEND
} from '../actions/ActionTypes';

import {
    getEnsitmatedCommissionValueSuccess,
    getEnsitmatedCommissionValueFailure,
    getReferralChannelUserCountSuccess,
    getReferralChannelUserCountFailure,
    getReferralUrlSuccess, getReferralUrlFailure,
    getReferralDescriptionDataSuccess, getReferralDescriptionDataFailure,
    getReferralCodeSuccess, getReferralCodeFailure,
    getReferralEmailDataSuccess, getReferralEmailDataFailure,
    getReferralSmsDataSuccess, getReferralSmsDataFailure
} from '../actions/CMS/RefereEarnAction';

import { userAccessToken } from '../selector';
import { swaggerPostAPI } from '../api/helper';
import { Method } from '../controllers/Constants';

// Generator for Estimated Commission Value Data
function* getEnstimatedCommissionValueData(_action) {
    try {
        // To call Estimated Commission Value api
        const response = yield call(getEnstimatedCommissionValueApi)

        // To set Estimated Commission Value success response to reducer
        yield put(getEnsitmatedCommissionValueSuccess(response));
    } catch (e) {
        // To set Estimated Commission Value failure response to reducer
        yield put(getEnsitmatedCommissionValueFailure(e));
    }
}

export function getEnstimatedCommissionValueApi() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve({
                "returnCode": 0,
                "statusCode": 200,
                "returnMsg": "success",
                "programDetails": `Effective as of 2018/05/19 0:00 AM (UTC) \n\nThe commission you receive from the referral program will initially be set at a rate of 20%. For accounts holding 500 BTC or more, this rate will increase to 40%. \n\nThe fee commission will be sent instantly in real-time to your account as your referee completes each trade and will be paid to you in whatever token/cryptocurrency the original fee was paid in. \n\nThere is no limit to the number of friends you can refer, although we do reserve the right to adjust or change the referral program rules at any time. \n\nEach referee must be signed up through your Referral Link, QR Code or Referral ID. \n\nWe will check for duplicate or fake accounts and will not pay out referral bonuses on these accounts. Duplicate or shared finances will result in disqualification.`,
                "importantNotice": `We reserves the right to change the terms of the referral program at any time due to changing market conditions, risk of fraud, or any other factors we deem relevant.`,
                "Response": [
                    {
                        id: 1,
                        commission: '0000 BTC',
                        email: 'dipesh@jbspl.com',
                        date: '2019-02-09',
                    },
                    {
                        id: 2,
                        commission: '0000 BTC',
                        email: 'dipesh@jbspl.com',
                        date: '2019-02-09',
                    },
                    {
                        id: 3,
                        commission: '0000 BTC',
                        email: 'dipesh@jbspl.com',
                        date: '2019-02-09',
                    },
                    {
                        id: 4,
                        commission: '0000 BTC',
                        email: 'dipesh@jbspl.com',
                        date: '2019-02-09',
                    },
                ]
            })
        }, 200)
    })
}

function* getReferralUserCount() {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Referral User Count api
        const response = yield call(swaggerPostAPI, Method.AllCountForUserReferralChannel, {}, headers);

        // To set Referral Channel User Count success response to reducer
        yield put(getReferralChannelUserCountSuccess(response));
    } catch (error) {
        // To set Referral Channel User Count failure response to reducer
        yield put(getReferralChannelUserCountFailure(error));
    }
}

function* getReferralUrlsData() {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Referral Urls Data api
        const response = yield call(swaggerPostAPI, Method.GetReferralURL, {}, headers);

        // To set Referral Urls Data success response to reducer
        yield put(getReferralUrlSuccess(response));
    } catch (error) {
        // To set Referral Urls Data failure response to reducer
        yield put(getReferralUrlFailure(error));
    }
}

function* getReferralDescriptionData() {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Referral Description Data api
        const response = yield call(swaggerPostAPI, Method.GetReferralService, {}, headers);

        // To set Referral Description Data success response to reducer
        yield put(getReferralDescriptionDataSuccess(response));
    } catch (error) {
        // To set Referral Description Data failure response to reducer
        yield put(getReferralDescriptionDataFailure(error));
    }
}

function* getReferralCodeData() {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call User Referral Code api
        const response = yield call(swaggerPostAPI, Method.GetUserReferralCode, {}, headers);

        // To set Referral Code success response to reducer
        yield put(getReferralCodeSuccess(response));
    } catch (error) {
        // To set Referral Code failure response to reducer
        yield put(getReferralCodeFailure(error));
    }
}

function* getReferralEmailSendData(action) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Referral Email Send Data api
        const response = yield call(swaggerPostAPI, Method.SendReferralEmail, action.request, headers);

        // To set Referral Email Data success response to reducer
        yield put(getReferralEmailDataSuccess(response));
    } catch (error) {
        // To set Referral Email Data failure response to reducer
        yield put(getReferralEmailDataFailure(error));
    }
}

function* getReferralSmsData(action) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call User Referral Code api
        const response = yield call(swaggerPostAPI, Method.SendReferralSMS, action.request, headers);

        // To set Referral Sms Data success response to reducer
        yield put(getReferralSmsDataSuccess(response));
    } catch (error) {
        // To set Referral Sms Data failure response to reducer
        yield put(getReferralSmsDataFailure(error));
    }
}

function* RefereEarnSaga() {
    // To register Estimated Commission method
    yield takeLatest(GET_ENSTIMATED_COMMISSION, getEnstimatedCommissionValueData)
    // To register Referral Channel User Count method
    yield takeLatest(GET_REFERRAL_CHANNEL_USER_COUNT, getReferralUserCount)
    // To register Referral Url method
    yield takeLatest(GET_REFERRAL_URL, getReferralUrlsData)
    // To register Referral Service Description method
    yield takeLatest(GET_REFERRAL_SERVICE_DESCRIPTION, getReferralDescriptionData)
    // To register Referral Code method
    yield takeLatest(GET_REFERRAL_CODE, getReferralCodeData)
    // To register Referral Email method
    yield takeLatest(REFERRAL_EMAIL_SEND, getReferralEmailSendData)
    // To register Referral SMS method
    yield takeLatest(REFERRAL_SMS_SEND, getReferralSmsData)
}
export default RefereEarnSaga;