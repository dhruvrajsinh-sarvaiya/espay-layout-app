//Sagas Effects..
import { all, call, select, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import { AFFILIATE_SIGNUP, GET_AFFILIATE_COMMISSION_PATTERN } from '../actions/ActionTypes';

//Action methods..
import {
    affiliateSignupSuccess,
    affiliateSignupFailure,
    getAffiliateCommissionPatternSuccess,
    getAffiliateCommissionPatternFailure
} from '../actions/Affiliate/AffiliateSignUpAction.js';
import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';
import { swaggerPostAPI, swaggerGetAPI } from '../api/helper';
import { getIPAddress } from '../controllers/CommonUtils';

// Generator for Affiliate Signup
function* affiliateSignupAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty then show static slow internet dialog
        if (payload.ipAddress === '') {
            yield put(affiliateSignupSuccess(slowInternetStaticResponse()));
        } else {

            // To call Affiliate Signup api
            const response = yield call(swaggerPostAPI, Method.AffiliateRegister, payload, headers);

            // To set affiliate signup success response to reducer
            yield put(affiliateSignupSuccess(response));
        }
    } catch (error) {
        // To set affiliate signup failure response to reducer
        yield put(affiliateSignupFailure(error));
    }
}

// Generator for Get Commission Pattern
/*
* Type : 0 for Basic & 1 for Full Detail 
*/
function* getAffiliateCommissionPatternAPI({ payload }) {
    try {
        // To call Affiliate Commission Pattern api
        const response = yield call(swaggerGetAPI, Method.GetAffiliateSchemeType + payload.type, {});

        // To set affiliate commission pattern success response to reducer
        yield put(getAffiliateCommissionPatternSuccess(response));
    } catch (error) {
        // To set affiliate commission pattern failure response to reducer
        yield put(getAffiliateCommissionPatternFailure(error));
    }
}

/* Create Sagas method for Affiliate Signup */
export function* affiliateSignupSagas() {
    yield takeEvery(AFFILIATE_SIGNUP, affiliateSignupAPI);
}

/* Create Sagas method for Get Commissoin Pattern */
export function* getAffiliateCommissionPatternSagas() {
    yield takeEvery(GET_AFFILIATE_COMMISSION_PATTERN, getAffiliateCommissionPatternAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        // To register Affiliate Signup method 
        fork(affiliateSignupSagas),
        // To register Affiliate Commission Pattern method 
        fork(getAffiliateCommissionPatternSagas),
    ]);
}