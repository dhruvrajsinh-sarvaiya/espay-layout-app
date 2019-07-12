// ReferralSystemCountSaga
import { put, call, takeLatest,select } from 'redux-saga/effects';

import {
    GET_REFERRAL_INVITES_LIST,
    GET_REFERRAL_EMAIL_LIST,
    GET_REFERRAL_PARTICIPANT_LIST,
    GET_REFERRAL_CLICKS_LIST,
    GET_REFERRAL_CONVERTS_LIST,
} from '../actions/ActionTypes';

import { Method } from '../controllers/Constants';
import { swaggerPostAPI, queryBuilder } from '../api/helper';

import {
    getReferralInvitesListSuccess,getReferralInvitesListFailure,
    getReferralEmailListSuccess,getReferralEmailListFailure,
    getReferralParticipantListSuccess,getReferralParticipantListFailure,
    getReferralClicksListSuccess,getReferralClicksListFailure,
    getReferralConvertListSuccess,getReferralConvertListFailure
} from '../actions/account/ReferralSytem/ReferralSystemCountAction';
import { userAccessToken } from '../selector';

// Generator for Referral Invites List
function* referralInvites(action) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Referral Invites Code api
        const response = yield call(swaggerPostAPI, Method.ListUserReferralChannelInvite + queryBuilder(action.data,true), {}, headers)

        // To set Referral Invites List success response to reducer
        yield put(getReferralInvitesListSuccess(response))
    } catch (e) {
        // To set Referral Invites List failure response to reducer
        yield put(getReferralInvitesListFailure())
    }
}

// Generator for Referral Email List
function* referralEmailData(action) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }
        
        // To call Referral Email Code api
        const response = yield call(swaggerPostAPI, Method.ListAdminReferralChannelWithChannelType + queryBuilder(action.data,true), {}, headers)
        
        // To set Referral Email List success response to reducer
        yield put(getReferralEmailListSuccess(response))
    } catch (e) {
        // To set Referral Email List failure response to reducer
        yield put(getReferralEmailListFailure())
    }
}

// Generator for Referral Participant List
function* referralParticipantData(action) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Referral Participant Code api
        const response = yield call(swaggerPostAPI, Method.ListUserParticipateReferralUser + queryBuilder(action.data,true), {}, headers)
        
        // To set Referral Participant List success response to reducer
        yield put(getReferralParticipantListSuccess(response))
    } catch (e) {
        // To set Referral Participant List failure response to reducer
        yield put(getReferralParticipantListFailure())
    }
}

// Generator for Referral Click List
function* referralClicksData(action) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Referral Click Code api
        const response = yield call(swaggerPostAPI, Method.ListUserReferralUserClick + queryBuilder(action.data,true), {}, headers)
        
        // To set Referral Click List success response to reducer
        yield put(getReferralClicksListSuccess(response))
    } catch (e) {
        // To set Referral Click List failure response to reducer
        yield put(getReferralClicksListFailure())
    }
}

// Generator for Referral Convert List
function* referralConvertsData(action) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Referral Convert Code api
        const response = yield call(swaggerPostAPI, Method.ListUserReferralRewards + queryBuilder(action.data,true), {}, headers)
        
        // To set Referral Convert List success response to reducer
        yield put(getReferralConvertListSuccess(response))
    } catch (e) {
        // To set Referral Convert List failure response to reducer
        yield put(getReferralConvertListFailure())
    }
}

function* ReferralSystemCountSaga() {
    // To register Referral Invites List method
    yield takeLatest(GET_REFERRAL_INVITES_LIST, referralInvites);
    // To register Referral Email List method
    yield takeLatest(GET_REFERRAL_EMAIL_LIST, referralEmailData);
    // To register Referral Participant List method
    yield takeLatest(GET_REFERRAL_PARTICIPANT_LIST, referralParticipantData);
    // To register Referral Click List method
    yield takeLatest( GET_REFERRAL_CLICKS_LIST, referralClicksData);
    // To register Referral Convert List method
    yield takeLatest( GET_REFERRAL_CONVERTS_LIST, referralConvertsData);
}

export default ReferralSystemCountSaga;