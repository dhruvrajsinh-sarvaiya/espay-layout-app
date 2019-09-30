import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import {
    GET_REFERRAL_LIST, ENABLE_REFERRAL_STATUS, DISABLE_REFERRAL_STATUS, ADD_REFERRAL, EDIT_REFERRAL, REFERRAL_SERVICE_TYPE, REFERRAL_PAY_TYPE,
} from "../../actions/ActionTypes";

import {
    referralListSuccess,
    referralListFailure,
    enableStatusSuccess,
    enableStatusFailure,
    disableStatusSuccess,
    disableStatusFailure,
    addRefferalSuccess,
    addRefferalFailure,
    editReferralSuccess,
    editReferralFailure,
    getRefferalServiceTypeSuccess,
    getRefferalServiceTypeFailure,
    getRefferalPayTypeSuccess,
    getRefferalPayTypeFailure,
} from "../../actions/account/ReferralAction"
import { userAccessToken } from '../../selector';
import { Method } from '../../controllers/Constants';
//Get function form helper for Swagger API Call
import { queryBuilder, swaggerPostAPI } from "../../api/helper";

function* getReferralListApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call List Referral Service Api
        const response = yield call(swaggerPostAPI, Method.ListReferralService + queryBuilder(payload), {}, headers);

        // To set Referral Service list success response to reducer
        yield put(referralListSuccess(response));
    } catch (error) {

        // To set Referral Service list success response to reducer
        yield put(referralListFailure(error));
    }
}

function* enableReffrelStatusApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call enable Referral Service Api
        const response = yield call(swaggerPostAPI, Method.EnableReferralService, payload, headers);

        // To set Referral Service enable success response to reducer
        yield put(enableStatusSuccess(response));
    } catch (error) {

        // To set Referral Service enable success response to reducer
        yield put(enableStatusFailure(error));
    }
}

function* disableReffrelStatusApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call disable Referral Service Api
        const response = yield call(swaggerPostAPI, Method.DisableReferralService, payload, headers);

        // To set Referral Service disable success response to reducer
        yield put(disableStatusSuccess(response));
    } catch (error) {

        // To set Referral Service disable failure response to reducer
        yield put(disableStatusFailure(error));
    }
}

function* addReferralApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call add Referral Service Api
        const response = yield call(swaggerPostAPI, Method.AddReferralService, payload, headers);

        // To set Referral Service add success response to reducer
        yield put(addRefferalSuccess(response));
    } catch (error) {

        // To set Referral Service add failure response to reducer
        yield put(addRefferalFailure(error));
    }
}

function* editRefferalApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call edit Referral Service Api
        const response = yield call(swaggerPostAPI, Method.UpdateReferralService, payload, headers);

        // To set Referral Service edit success response to reducer
        yield put(editReferralSuccess(response));
    } catch (error) {

        // To set Referral Service edit failure response to reducer
        yield put(editReferralFailure(error));
    }
}

function* getRefferalServiceTypeApi() {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Referral Service type Api
        const response = yield call(swaggerPostAPI, Method.DropDownReferralServiceType, {}, headers);

        // To set Referral Service type success response to reducer
        yield put(getRefferalServiceTypeSuccess(response));
    } catch (error) {

        // To set Referral Service type failure response to reducer
        yield put(getRefferalServiceTypeFailure(error));
    }
}

function* getRefferalPayTypeApi() {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Referral Service paytype Api
        const response = yield call(swaggerPostAPI, Method.DropDownReferralPayType, {}, headers);

        // To set Referral Service paytype success response to reducer
        yield put(getRefferalPayTypeSuccess(response));
    } catch (error) {

        // To set Referral Service paytype failure response to reducer
        yield put(getRefferalPayTypeFailure(error));
    }
}

export function* referralSagas() {
    //for get Referral Reward List
    yield takeEvery(GET_REFERRAL_LIST, getReferralListApi);

    //for Refferal Enable status
    yield takeEvery(ENABLE_REFERRAL_STATUS, enableReffrelStatusApi);

    //for Refferal Disable status
    yield takeEvery(DISABLE_REFERRAL_STATUS, disableReffrelStatusApi);

    //for Refferal Add
    yield takeEvery(ADD_REFERRAL, addReferralApi);

    //for Refferal Edit
    yield takeEvery(EDIT_REFERRAL, editRefferalApi);

    //for Refferal SeriviceType
    yield takeEvery(REFERRAL_SERVICE_TYPE, getRefferalServiceTypeApi);

    //for Refferal Paytype
    yield takeEvery(REFERRAL_PAY_TYPE, getRefferalPayTypeApi);
}

export default function* rootSaga() {
    yield all([
        fork(referralSagas),
    ]);
}
