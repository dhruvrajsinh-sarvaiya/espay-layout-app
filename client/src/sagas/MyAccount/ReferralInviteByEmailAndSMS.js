/**
 * Create By Sanjay
 * Created Date : 04/03/2019
 * Saga File For Referral Invite By Email and SMS
 */

import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import {
    SEND_REFERRAL_BY_EMAIL,
    SEND_REFERRAL_BY_SMS
} from 'Actions/types';

import {
    sendReferralInvitationByEmailSuccess,
    sendReferralInvitationByEmailFailure,
    sendReferralInvitationBySMSSuccess,
    sendReferralInvitationBySMSFailure
} from 'Actions/MyAccount';

//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';

function* sendReferralInviteByEmailDataAPI({payload}) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/SendReferralEmail', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(sendReferralInvitationByEmailSuccess(response));
        } else {
            yield put(sendReferralInvitationByEmailFailure(response));
        }
    } catch (error) {
        yield put(sendReferralInvitationByEmailFailure(error));
    }
}

function* sendReferralInviteBySMSDataAPI({payload}) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/SendReferralSMS', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(sendReferralInvitationBySMSSuccess(response));
        } else {
            yield put(sendReferralInvitationBySMSFailure(response));
        }
    } catch (error) {
        yield put(sendReferralInvitationBySMSFailure(error));
    }
}

function* sendReferralInviteByEmailData() {
    yield takeEvery(SEND_REFERRAL_BY_EMAIL, sendReferralInviteByEmailDataAPI);
}

function* sendReferralInviteBySMSData() {
    yield takeEvery(SEND_REFERRAL_BY_SMS, sendReferralInviteBySMSDataAPI);
}
export default function* rootSaga() {
    yield all([
        fork(sendReferralInviteByEmailData),
        fork(sendReferralInviteBySMSData)
    ]);
}