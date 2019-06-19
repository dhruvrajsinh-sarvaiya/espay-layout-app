/**
 * Auther : Salim Deraiya
 * Created : 11/02/2019
 * Affiliate Program Sagas
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import {
    AFFILIATE_SIGNUP,
    AFFILIATE_RESEND_CONFIRMATION_LINK,
    AFFILIATE_CONFIRMATION_LINK,
    GET_AFFILIATE_COMMISSION_PATTERN
} from 'Actions/types';

//Action methods..
import {
    affiliateSignupSuccess,
    affiliateSignupFailure,
    affiliateResendConfirmationLinkSuccess,
    affiliateResendConfirmationLinkFailure,
    affiliateConfirmationLinkSuccess,
    affiliateConfirmationLinkFailure,
    getAffiliateCommissionPatternSuccess,
    getAffiliateCommissionPatternFailure
} from 'Actions/MyAccount';

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Function for Affiliate Signup
function* affiliateSignupAPI({ payload }) {
    var sUrl = 'api/Affiliate/AffiliateRegister';
    if(payload.passdata !== '' && payload.passdata !== undefined) {
        sUrl += '?passdata='+payload.passdata;
    }

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, sUrl, payload, headers);

    try {
        if (response.statusCode === 200) {
            yield put(affiliateSignupSuccess(response));
        } else {
            yield put(affiliateSignupFailure(response));
        }
    } catch (error) {
        yield put(affiliateSignupFailure(error));
    }
}

//Function for Affiliate Resend Confirmation Link
function* affiliateResendConfirmationLinkAPI({payload}) {
    const response = yield call(swaggerPostAPI,'api/Affiliate/ReSendAffiliateRegisterlink',payload);
    try {
        if(response.ReturnCode === 0) {
            yield put(affiliateResendConfirmationLinkSuccess(response));
        } else {
            yield put(affiliateResendConfirmationLinkFailure(response));
        }
    } catch (error) {
        yield put(affiliateResendConfirmationLinkFailure(error));
    }
}

//Function for Affiliate Confirmation Link
function* affiliateConfirmationLinkAPI({payload}) {
    const response = yield call(swaggerGetAPI,'api/Affiliate/AffiliateConfirmEmail?emailConfirmCode='+payload.emailConfirmCode,{});
    
    try {
        if(response.ReturnCode === 0) {
            yield put(affiliateConfirmationLinkSuccess(response));
        } else {
            yield put(affiliateConfirmationLinkFailure(response));
        }
    } catch (error) {
        yield put(affiliateConfirmationLinkFailure(error));
    }
}

//Function for Get Commission Pattern
/*
* Type : 0 for Basic & 1 for Full Detail 
*/
function* getAffiliateCommissionPatternAPI({ payload }) {
    const response = yield call(swaggerGetAPI, 'api/Affiliate/GetAffiliateSchemeType/'+payload.type, {});

    try {
        if (response.statusCode === 200) {
            yield put(getAffiliateCommissionPatternSuccess(response));
        } else {
            yield put(getAffiliateCommissionPatternFailure(response));
        }
    } catch (error) {
        yield put(getAffiliateCommissionPatternFailure(error));
    }
}

/* Create Sagas method for Affiliate Signup */
export function* affiliateSignupSagas() {
    yield takeEvery(AFFILIATE_SIGNUP, affiliateSignupAPI);
}

/* Create Sagas method for Affiliate Resend Confirmation Link */
export function* affiliateResendConfirmationLinkSagas() {
    yield takeEvery(AFFILIATE_RESEND_CONFIRMATION_LINK, affiliateResendConfirmationLinkAPI);
}

/* Create Sagas method for Affiliate Confirmation Link */
export function* affiliateConfirmationLinkSagas() {
    yield takeEvery(AFFILIATE_CONFIRMATION_LINK, affiliateConfirmationLinkAPI);
}

/* Create Sagas method for Get Commissoin Pattern */
export function* getAffiliateCommissionPatternSagas() {
    yield takeEvery(GET_AFFILIATE_COMMISSION_PATTERN, getAffiliateCommissionPatternAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(affiliateSignupSagas),
        fork(affiliateResendConfirmationLinkSagas),
        fork(affiliateConfirmationLinkSagas),
        fork(getAffiliateCommissionPatternSagas),
    ]);
}