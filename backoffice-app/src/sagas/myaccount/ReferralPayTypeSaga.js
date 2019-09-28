/**
 * Created By Dipesh
 * Created Date 28/02/2019
 * Saga File For Referral PayType
 */
import { all, call, fork, put, select, takeEvery } from "redux-saga/effects";

import {
    LIST_REFERRAL_PAY_TYPE,
    ADD_REFERRAL_PAY_TYPE,
    UPDATE_REFERRAL_PAY_TYPE,
    ACTIVE_REFERRAL_PAY_TYPE,
    INACTIVE_REFERRAL_PAY_TYPE,
} from "../../actions/ActionTypes";

// import functions from action
import {
    getReferralPayTypeDataSuccess,
    getReferralPayTypeDataFailure,
    addReferralPayTypeSuccess,
    addReferralPayTypeFailure,
    updateReferralPayTypeSuccess,
    updateReferralPayTypeFailure,
    activePayTypeSuccess,
    activePayTypeFailure,
    inactivePayTypeSuccess,
    inactivePayTypeFailure,
} from "../../actions/account/ReferralPayTypeAction";
import { userAccessToken } from "../../selector";
import { Method as MethodBO } from "../../controllers/Constants";
import { swaggerPostAPI } from "../../api/helper";

//Display referral PayType Data
function* getReferralPayTypeAPI() {

    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call referral list pay type Api
        const response = yield call(swaggerPostAPI, MethodBO.ListReferralPayType, {}, headers);

        // To set referral paytpe success response to reducer 
        yield put(getReferralPayTypeDataSuccess(response));

    } catch (error) {

        // To set referral paytpe failure response to reducer
        yield put(getReferralPayTypeDataFailure(error));
    }
}

//Add referral PayType Data
function* addReferralPayTypeAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call add paytype Api
        const response = yield call(swaggerPostAPI, MethodBO.AddPayType, payload, headers);

        // To set add paytpe success response to reducer
        yield put(addReferralPayTypeSuccess(response));

    } catch (error) {

        // To set add paytpe failure response to reducer
        yield put(addReferralPayTypeFailure(error));
    }
}

//Edit/Update referral PayType Data
function* updateReferralPayTypeAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call edit paytype Api
        const response = yield call(swaggerPostAPI, MethodBO.UpdateReferralPayType, payload, headers);

        // To set edit paytpe success response to reducer
        yield put(updateReferralPayTypeSuccess(response));

    } catch (error) {

        // To set edit paytpe failure response to reducer
        yield put(updateReferralPayTypeFailure(error));
    }
}

//Active PayType Data
function* activePayTypeDataAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call enable paytpe  Api
        const response = yield call(swaggerPostAPI, MethodBO.EnableReferralPayType, payload, headers);

        // To set enable paytpe success response to reducer
        yield put(activePayTypeSuccess(response));

    } catch (error) {

        // To set enable paytpe failure response to reducer
        yield put(activePayTypeFailure(error));
    }
}

//InActive PayType Data
function* inactivePayTypeDataAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call inactive paytpe Api
        const response = yield call(swaggerPostAPI, MethodBO.DisableReferralPayType, payload, headers);

        // To set inactive paytpe success response to reducer
        yield put(inactivePayTypeSuccess(response));

    } catch (error) {

        // To set inactive paytpe failure response to reducer
        yield put(inactivePayTypeFailure(error));
    }
}

function* getReferralPayType() {
    yield takeEvery(LIST_REFERRAL_PAY_TYPE, getReferralPayTypeAPI);
}

function* addReferralPayType() {
    yield takeEvery(ADD_REFERRAL_PAY_TYPE, addReferralPayTypeAPI);
}

function* UpdateReferralPayType() {
    yield takeEvery(UPDATE_REFERRAL_PAY_TYPE, updateReferralPayTypeAPI);
}

function* activePayTypeData() {
    yield takeEvery(ACTIVE_REFERRAL_PAY_TYPE, activePayTypeDataAPI);
}

function* inactivePayTypeData() {
    yield takeEvery(INACTIVE_REFERRAL_PAY_TYPE, inactivePayTypeDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getReferralPayType),
        fork(addReferralPayType),
        fork(UpdateReferralPayType),
        fork(activePayTypeData),
        fork(inactivePayTypeData),
    ]);
}