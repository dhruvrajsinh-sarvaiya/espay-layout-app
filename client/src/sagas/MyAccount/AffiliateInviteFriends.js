/**
 * Author : Saloni Rathod
 * Created :07/03/2019
 * Affiliate Invite Friends saga
*/
import { all, fork, call, put, takeEvery } from "redux-saga/effects";
import { AFFILIATE_EMAIL_PROMO, AFFILIATE_SMS_PROMO, AFFILIATE_SOCIAL_SHARING_PROMO, GET_AFFILIATE_PROMOTION_LINK } from "Actions/types";
import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

// import functions from action
import {
    AffiliateEmailPromoSuccess,
    AffiliateEmailPromoFailure,
    AffiliateSmsPromoSuccess,
    AffiliateSmsPromoFailure,
    AffiliateSocialSharingSuccess,
    AffiliateSocialSharingFailure,
    GetAffiliatePromotionLinkSuccess,
    GetAffiliatePromotionLinkFailure
} from "Actions/MyAccount";

// For email promotion
function* AffiliateEmailPromoApi({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Affiliate/SendAffiliateEmail', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(AffiliateEmailPromoSuccess(response));
        } else {
            yield put(AffiliateEmailPromoFailure(response));
        }
    } catch (error) {
        yield put(AffiliateEmailPromoFailure(error));
    }
}

//for sms promotion
function* AffiliateSmsPromoApi({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Affiliate/SendAffiliateSMS', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(AffiliateSmsPromoSuccess(response));
        } else {
            yield put(AffiliateSmsPromoFailure(response));
        }
    } catch (error) {
        yield put(AffiliateSmsPromoFailure(error));
    }
}

//for social sharing promotion
/* function* AffiliateSocialSharingPromoApi({ payload }) {
    //var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerGetAPI, '/api/SignUpReport/GetUserSignUpCount/', {}, headers);
    try {
        if (payload) {
            yield put(AffiliateSocialSharingSuccess(payload));
        } else {
            yield put(AffiliateSocialSharingFailure(payload));
        }
    } catch (error) {
        yield put(AffiliateSocialSharingFailure(error));
    }
} */

function* AffiliatePromoLinkApi({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/Affiliate/GetAffiliatePromotionLink', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(GetAffiliatePromotionLinkSuccess(response));
        } else {
            yield put(GetAffiliatePromotionLinkFailure(response));
        }
    } catch (error) {
        yield put(GetAffiliatePromotionLinkFailure(error));
    }
}

function* AffiliateEmailPromoApiData() {
    yield takeEvery(AFFILIATE_EMAIL_PROMO, AffiliateEmailPromoApi);
}

function* AffiliateSmsPromoApiData() {
    yield takeEvery(AFFILIATE_SMS_PROMO, AffiliateSmsPromoApi);
}

/* function* AffiliateSocialSharingPromoApiData() {
    yield takeEvery(AFFILIATE_SOCIAL_SHARING_PROMO, AffiliateSocialSharingPromoApi);
} */

function* AffiliatePromoLinkApiData() {
    yield takeEvery(GET_AFFILIATE_PROMOTION_LINK, AffiliatePromoLinkApi);
}

export default function* rootSaga() {
    yield all([fork(AffiliateEmailPromoApiData),
    fork(AffiliateSmsPromoApiData),
    // fork(AffiliateSocialSharingPromoApiData),
    fork(AffiliatePromoLinkApiData)
    ]);
}