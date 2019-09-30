/**
 * Created By Dipesh
 * Created Date 27/02/2019
 * Saga File For Referral ChannelType
 */
import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import {
    LIST_REFERRAL_CHANNEL_TYPE,
    ADD_REFERRAL_CHANNEL_TYPE,
    UPDATE_REFERRAL_CHANNEL_TYPE,
    ACTIVE_REFERRAL_CHANNEL_TYPE,
    INACTIVE_REFERRAL_CHANNEL_TYPE,
} from "../../actions/ActionTypes";

// import functions from action
import {
    getReferralChannelTypeDataSuccess,
    getReferralChannelTypeDataFailure,
    addReferralChannelTypeSuccess,
    addReferralChannelTypeFailure,
    updateReferralChannelTypeSuccess,
    updateReferralChannelTypeFailure,
    activeChannelTypeSuccess,
    activeChannelTypeFailure,
    inactiveChannelTypeSuccess,
    inactiveChannelTypeFailure,
} from "../../actions/account/ReferralChannelTypeAction";
import { userAccessToken } from "../../selector";
import { swaggerPostAPI } from '../../api/helper';
import { Method as MethodBO } from "../../controllers/Constants";

//Display referral ChannelType Data
function* getReferralChannelTypeAPI() {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call referral chanel type list Api
        const response = yield call(swaggerPostAPI, MethodBO.ListReferralChannelType, {}, headers);

        // To set referral chanel type list success response to reducer
        yield put(getReferralChannelTypeDataSuccess(response));

    } catch (error) {

        // To set referral chanel type list failure response to reducer
        yield put(getReferralChannelTypeDataFailure(error));
    }
}

//Add referral ChannelType Data
function* addReferralChannelTypeAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call add chanel type Api
        const response = yield call(swaggerPostAPI, MethodBO.AddChannelType, payload, headers);

        // To set add chanel type success response to reducer
        yield put(addReferralChannelTypeSuccess(response));

    } catch (error) {

        // To set add chanel type failure response to reducer
        yield put(addReferralChannelTypeFailure(error));
    }
}

//Edit/Update referral ChannelType Data
function* updateReferralChannelTypeAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call edit chanel type Api
        const response = yield call(swaggerPostAPI, MethodBO.UpdateReferralChannelType, payload, headers);

        // To set edit chanel type success response to reducer
        yield put(updateReferralChannelTypeSuccess(response));

    } catch (error) {

        // To set edit chanel type failure response to reducerF
        yield put(updateReferralChannelTypeFailure(error));
    }
}

//Active ChannelType Data
function* activeChannelTypeDataAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call active chanel type Api
        const response = yield call(swaggerPostAPI, MethodBO.EnableReferralChannelType, payload, headers);

        // To set active chanel type success response to reducer
        yield put(activeChannelTypeSuccess(response));

    } catch (error) {

        // To set active chanel type failure response to reducer
        yield put(activeChannelTypeFailure(error));
    }
}

//InActive ChannelType Data
function* inactiveChannelTypeDataAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Inactive chanel type Api
        const response = yield call(swaggerPostAPI, MethodBO.DisableReferralChannelType, payload, headers);

        // To set Inactive chanel type success response to reducer
        yield put(inactiveChannelTypeSuccess(response));

    } catch (error) {

        // To set Inactive chanel type failure response to reducer
        yield put(inactiveChannelTypeFailure(error));
    }
}

function* getReferralChannelType() {
    yield takeEvery(LIST_REFERRAL_CHANNEL_TYPE, getReferralChannelTypeAPI);
}

function* addReferralChannelType() {
    yield takeEvery(ADD_REFERRAL_CHANNEL_TYPE, addReferralChannelTypeAPI);
}

function* UpdateReferralChannelType() {
    yield takeEvery(UPDATE_REFERRAL_CHANNEL_TYPE, updateReferralChannelTypeAPI);
}

function* activeChannelTypeData() {
    yield takeEvery(ACTIVE_REFERRAL_CHANNEL_TYPE, activeChannelTypeDataAPI);
}

function* inactiveChannelTypeData() {
    yield takeEvery(INACTIVE_REFERRAL_CHANNEL_TYPE, inactiveChannelTypeDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getReferralChannelType),
        fork(addReferralChannelType),
        fork(UpdateReferralChannelType),
        fork(activeChannelTypeData),
        fork(inactiveChannelTypeData),
    ]);
}