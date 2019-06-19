/**
 * Created By Sanjay
 * Created Date 11/02/2019
 * Saga For Referral Dashboard
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    GET_COUNT_REFERRAL_DASHBOARD,
} from "Actions/types";
// import functions from action
import {
    getCountReferralDashboardSuccess,
    getCountReferralDashboardFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';

//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//Display Application Data
function* getCountReferralDashboardAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Referral/AllCountForAdminReferralChannel', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getCountReferralDashboardSuccess(response));
        } else {
            yield put(getCountReferralDashboardFailure(response));
        }
    } catch (error) {
        yield put(getCountReferralDashboardFailure(error));
    }
}

//Display Application Data
function* getCountReferralDashboard() {
    yield takeEvery(GET_COUNT_REFERRAL_DASHBOARD, getCountReferralDashboardAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getCountReferralDashboard)
    ]);
}