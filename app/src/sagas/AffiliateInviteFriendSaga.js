// AffiliateInviteFriendSaga
import { put, call, takeLatest, select } from 'redux-saga/effects';
import {
    GET_AFFILIATE_INVITE_LINK,
    AFFILIATE_INVITE_BY_EMAIL,
    AFFILIATE_INVITE_BY_SMS
} from '../actions/ActionTypes';
import {
    getAffiliateInviteLinkSuccess, getAffiliateInviteLinkFailure,
    shareAffiliateInviteLinkByEmailSuccess, shareAffiliateInviteLinkByEmailFailure,
    shareAffiliateInviteLinkBySMSSuccess, shareAffiliateInviteLinkBySMSFailure
} from '../actions/Affiliate/AffiliateInviteFriendAction';

import { swaggerGetAPI, swaggerPostAPI, } from '../api/helper';
import { userAccessToken } from '../selector';
import { Method } from '../controllers/Constants';

// Generator for Affiliate Link
function* affiliateLinkData() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate invite link api
        const response = yield call(swaggerGetAPI, Method.GetAffiliatePromotionLink, {}, headers);

        // To set affiliate invite link success response to reducer
        yield put(getAffiliateInviteLinkSuccess(response))
    } catch (e) {
        // To set affiliate invite link failure response to reducer
        yield put(getAffiliateInviteLinkFailure())
    }
}

// Generator for Affiliate Link By Email
function* affiliateLinkbyEmail(action) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate invite link api
        const response = yield call(swaggerPostAPI, Method.SendAffiliateEmail, action.payload, headers);

        // To set affiliate invite link success response to reducer
        yield put(shareAffiliateInviteLinkByEmailSuccess(response))
    } catch (e) {
        // To set affiliate invite link failure response to reducer
        yield put(shareAffiliateInviteLinkByEmailFailure())
    }
}

// Generator for Affiliate Link By Sms
function* affiliateLinkbySMS(action) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate invite link by sms api
        const response = yield call(swaggerPostAPI, Method.SendAffiliateSMS, action.payload, headers);

        // To set affiliate invite link by sms success response to reducer
        yield put(shareAffiliateInviteLinkBySMSSuccess(response))
    } catch (e) {
        // To set affiliate invite link by sms failure response to reducer
        yield put(shareAffiliateInviteLinkBySMSFailure())
    }
}

function* AffiliateInviteFriendSaga() {
    // To register Affiliate Invite Link method 
    yield takeLatest(GET_AFFILIATE_INVITE_LINK, affiliateLinkData)
    // To register Affiliate Invite Email method 
    yield takeLatest(AFFILIATE_INVITE_BY_EMAIL, affiliateLinkbyEmail)
    // To register Affiliate Invite SMS method 
    yield takeLatest(AFFILIATE_INVITE_BY_SMS, affiliateLinkbySMS)

}
export default AffiliateInviteFriendSaga;

