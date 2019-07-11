/**
 * Author : Salim Deraiya
 * Created : 04/03/2019
 * Affiliate Configuration
*/

import { all, fork, call, put, takeEvery } from "redux-saga/effects";
import { 
    SAVE_AFFILIATE_SETUP_CONFIGURATION,
    GET_AFFILIATE_SETUP_CONFIGURATION,
    SAVE_AFFILIATE_COMMISSION_PATTERN,
    GET_AFFILIATE_COMMISSION_PATTERN
} from "Actions/types";
import AppConfig from 'Constants/AppConfig';
import {  swaggerGetAPI } from 'Helpers/helpers';

// import functions from action
import {
    saveAffiliateSetupConfigureSuccess,
    saveAffiliateSetupConfigureFailure,
    getAffiliateSetupConfigureSuccess,
    getAffiliateSetupConfigureFailure,
    saveAffiliateCommissionPatternSuccess,
    saveAffiliateCommissionPatternFailure,
    getAffiliateCommissionPatternSuccess,
    getAffiliateCommissionPatternFailure
} from "Actions/MyAccount";

const getSetupConfig = {
    ErrorCode: 0,
    ReturnCode: 0,
    ReturnMsg : 'Successfully',
    data : {
        isAffiliate : true,
        isSignupComission : true,
        isWithdraw : true,
        emailTemplate : 'emailTemplate',
        smsTemplate: 'smsTemplate',
        withdrawLimit: 10
    }
}

//Save Affiliate Setup Configuration API
function* saveAffiliateSetupConfigureApi({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/SignUpReport/GetUserSignUpCount', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(saveAffiliateSetupConfigureSuccess(response));
        } else {
            yield put(saveAffiliateSetupConfigureFailure(response));
        }
    } catch (error) {
        yield put(saveAffiliateSetupConfigureFailure(error));
    }
}

//Get Affiliate Setup Configuration API
function* getAffiliateSetupConfigureApi({ payload }) {

    try {
        if (getSetupConfig.ReturnCode === 0) {
            yield put(getAffiliateSetupConfigureSuccess(getSetupConfig));
        } else {
            yield put(getAffiliateSetupConfigureFailure(getSetupConfig));
        }
    } catch (error) {
        yield put(getAffiliateSetupConfigureFailure(error));
    }
}

//Save Affiliate Commission Pattern API
function* saveAffiliateCommissionPatternApi({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/SignUpReport/GetUserSignUpCount', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(saveAffiliateCommissionPatternSuccess(response));
        } else {
            yield put(saveAffiliateCommissionPatternFailure(response));
        }
    } catch (error) {
        yield put(saveAffiliateCommissionPatternFailure(error));
    }
}

//Get Affiliate Commission Pattern API
function* getAffiliateCommissionPatternApi({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/SignUpReport/GetUserSignUpCount', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getAffiliateCommissionPatternSuccess(response));
        } else {
            yield put(getAffiliateCommissionPatternFailure(response));
        }
    } catch (error) {
        yield put(getAffiliateCommissionPatternFailure(error));
    }
}

//Save Affiliate Setup Configuration Sagas
function* saveAffiliateSetupConfigureSagas() {
    yield takeEvery(SAVE_AFFILIATE_SETUP_CONFIGURATION, saveAffiliateSetupConfigureApi);
}

//Get Affiliate Setup Configuration Sagas
function* getAffiliateSetupConfigureSagas() {
    yield takeEvery(GET_AFFILIATE_SETUP_CONFIGURATION, getAffiliateSetupConfigureApi);
}

//Save Affiliate Commission Pattern Sagas
function* saveAffiliateCommissionPatternSagas() {
    yield takeEvery(SAVE_AFFILIATE_COMMISSION_PATTERN, saveAffiliateCommissionPatternApi);
}

//Get Affiliate Commission Pattern Sagas
function* getAffiliateCommissionPatternSagas() {
    yield takeEvery(GET_AFFILIATE_COMMISSION_PATTERN, getAffiliateCommissionPatternApi);
}

export default function* rootSaga() {
    yield all([
        fork(saveAffiliateSetupConfigureSagas),
        fork(getAffiliateSetupConfigureSagas),
        fork(saveAffiliateCommissionPatternSagas),
        fork(getAffiliateCommissionPatternSagas),
    ]);
}