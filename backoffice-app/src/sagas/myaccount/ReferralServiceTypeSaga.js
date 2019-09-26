/**
 * Created By Dipesh
 * Created Date 27/02/2019
 * Saga File For Referral ServiceType
 */
import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import {
    LIST_REFERRAL_SERVICE_TYPE,
    ADD_REFERRAL_SERVICE_TYPE,
    UPDATE_REFERRAL_SERVICE_TYPE,
    ACTIVE_REFERRAL_SERVICE_TYPE,
    INACTIVE_REFERRAL_SERVICE_TYPE,
} from "../../actions/ActionTypes";

// import functions from action
import {
    getReferralServiceTypeDataSuccess,
    getReferralServiceTypeDataFailure,
    addReferralServiceTypeSuccess,
    addReferralServiceTypeFailure,
    updateReferralServiceTypeSuccess,
    updateReferralServiceTypeFailure,
    activeServiceTypeSuccess,
    activeServiceTypeFailure,
    inactiveServiceTypeSuccess,
    inactiveServiceTypeFailure,
} from "../../actions/account/ReferralServiceTypeAction";
import { userAccessToken } from "../../selector";
import { swaggerPostAPI } from '../../api/helper';
import { Method as MethodBO } from "../../controllers/Constants";

//Display referral ServiceType Data
function* getReferralServiceTypeAPI() {
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerPostAPI, MethodBO.ListReferralServiceType, {}, headers);
    try {
        yield put(getReferralServiceTypeDataSuccess(response));
    } catch (error) {
        yield put(getReferralServiceTypeDataFailure(error));
    }
}

//Add referral ServiceType Data
function* addReferralServiceTypeAPI({ payload }) {
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerPostAPI, MethodBO.AddServiceType, payload, headers);
    try {

        yield put(addReferralServiceTypeSuccess(response));

    } catch (error) {
        yield put(addReferralServiceTypeFailure(error));
    }
}

//Edit/Update referral ServiceType Data
function* updateReferralServiceTypeAPI({ payload }) {
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerPostAPI, MethodBO.UpdateReferralServiceType, payload, headers);
    try {

        yield put(updateReferralServiceTypeSuccess(response));

    } catch (error) {
        yield put(updateReferralServiceTypeFailure(error));
    }
}

//Active ServiceType Data
function* activeServiceTypeDataAPI({ payload }) {
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerPostAPI, MethodBO.EnableReferralServiceType, payload, headers);
    try {

        yield put(activeServiceTypeSuccess(response));

    } catch (error) {
        yield put(activeServiceTypeFailure(error));
    }
}

//InActive ServiceType Data
function* inactiveServiceTypeDataAPI({ payload }) {
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerPostAPI, MethodBO.DisableReferralServiceType, payload, headers);
    try {

        yield put(inactiveServiceTypeSuccess(response));

    } catch (error) {
        yield put(inactiveServiceTypeFailure(error));
    }
}

function* activeServiceTypeData() {
    yield takeEvery(ACTIVE_REFERRAL_SERVICE_TYPE, activeServiceTypeDataAPI);
}

function* inactiveServiceTypeData() {
    yield takeEvery(INACTIVE_REFERRAL_SERVICE_TYPE, inactiveServiceTypeDataAPI);
}

function* getReferralServiceType() {
    yield takeEvery(LIST_REFERRAL_SERVICE_TYPE, getReferralServiceTypeAPI);
}

function* addReferralServiceType() {
    yield takeEvery(ADD_REFERRAL_SERVICE_TYPE, addReferralServiceTypeAPI);
}

function* UpdateReferralServiceType() {
    yield takeEvery(UPDATE_REFERRAL_SERVICE_TYPE, updateReferralServiceTypeAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getReferralServiceType),
        fork(addReferralServiceType),
        fork(UpdateReferralServiceType),
        fork(activeServiceTypeData),
        fork(inactiveServiceTypeData),
    ]);
}