// sagas For Api Key Policy Setting By Tejas 14/3/2019

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
    GET_API_KEY_POLICY_SETTING,
    UPDATE_API_KEY_POLICY_SETTING
} from "Actions/types";

// action sfor set data or Requests
import {
    getApiKeyPolicySettingSuccess,
    getApiKeyPolicySettingFailure,
    updateApiKeyPolicySettingSuccess,
    updateApiKeyPolicySettingFailure,
} from "Actions/ApiKeyConfiguration";

// Sagas Function for Get Api Key Policy List by :Tejas
function* getApiKeyPolicySetting() {
    yield takeEvery(GET_API_KEY_POLICY_SETTING, getApiKeyPolicySettingDetail);
}

// Function for set Request to data and Call Function for Api Call
function* getApiKeyPolicySettingDetail({ payload }) {
    //const { Data } = payload;

    try {
        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerPostAPI, 'api/BackOfficeAPIConfiguration/GetPublicAPIKeyPolicy', {}, headers);

        // set response if its available else set error message
        if (response && response != null && response.ReturnCode === 0) {
            yield put(getApiKeyPolicySettingSuccess(response));
        } else {
            yield put(getApiKeyPolicySettingFailure(response));
        }
    } catch (error) {
        yield put(getApiKeyPolicySettingFailure(error));
    }
}

// Sagas Function for update Api Key Policy List by :Tejas
function* updateApiKeyPolicySetting() {
    yield takeEvery(UPDATE_API_KEY_POLICY_SETTING, updateApiKeyPolicySettingDetail);
}

// Function for set Request to data and Call Function for Api Call
function* updateApiKeyPolicySettingDetail({ payload }) {
    //const { Data } = payload;

    try {
        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerPostAPI, 'api/BackOfficeAPIConfiguration/UpdatePublicAPIKeyPolicy', payload, headers);

        // set response if its available else set error message
        if (response && response != null && response.ReturnCode === 0) {
            yield put(updateApiKeyPolicySettingSuccess(response));
        } else {
            yield put(updateApiKeyPolicySettingFailure(response));
        }
    } catch (error) {
        yield put(updateApiKeyPolicySettingFailure(error));
    }
}

// Function for root saga
export default function* rootSaga() {
    yield all([
        fork(getApiKeyPolicySetting),
        fork(updateApiKeyPolicySetting)
    ]);
}
