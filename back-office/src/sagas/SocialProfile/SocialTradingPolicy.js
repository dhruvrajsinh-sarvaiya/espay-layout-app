/**
 * Auther : Kevin Ladani
 * Created : 19/12/2018
 * UpdatedBy : Salim Deraiya 22/12/2018
 * Social Profile Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import {
    GET_LEADER_TRADING_POLICY,
    EDIT_LEADER_TRADING_POLICY,
    GET_FOLLOWER_TRADING_POLICY,
    EDIT_FOLLOWER_TRADING_POLICY
} from 'Actions/types';

//Action methods..
import {
    getLeaderTradingPolicySuccess,
    getLeaderTradingPolicyFailure,
    editLeaderTradingPolicySuccess,
    editLeaderTradingPolicyFailure,
    getFollowerTradingPolicySuccess,
    getFollowerTradingPolicyFailure,
    editFollowerTradingPolicySuccess,
    editFollowerTradingPolicyFailure
} from 'Actions/SocialProfile';
//Get function form helper for Swagger API Call
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Function for Get Leader Configuration API
function* getLeaderTradingPolicyAPI() {
    const response = yield call(swaggerGetAPI, 'api/SocialProfile/GetLeaderProfile', {}, 1);
    try {
        if (response.ReturnCode === 0) {
            yield put(getLeaderTradingPolicySuccess(response));
        } else {
            yield put(getLeaderTradingPolicyFailure(response));
        }
    } catch (error) {
        yield put(getLeaderTradingPolicyFailure(error));
    }
}

//Function for Edit Leader Configuration API
function* editLeaderTradingPolicyAPI({ payload }) {
    const response = yield call(swaggerPostAPI, 'api/SocialProfile/SetLeaderProfile', payload, 1);
    try {
        if (response.ReturnCode === 0) {
            yield put(editLeaderTradingPolicySuccess(response));
        } else {
            yield put(editLeaderTradingPolicyFailure(response));
        }
    } catch (error) {
        yield put(editLeaderTradingPolicyFailure(error));
    }
}

//Function for Get Follower Configuration API
function* getFollowerTradingPolicyAPI() {
    const response = yield call(swaggerGetAPI, 'api/SocialProfile/GetFollowerProfile', {}, 1);
    try {
        if (response.ReturnCode === 0) {
            yield put(getFollowerTradingPolicySuccess(response));
        } else {
            yield put(getFollowerTradingPolicyFailure(response));
        }
    } catch (error) {
        yield put(getFollowerTradingPolicyFailure(error));
    }
}

//Function for Edit Follower Configuration API
function* editFollowerTradingPolicyAPI({ payload }) {
    const response = yield call(swaggerPostAPI, 'api/SocialProfile/SetFollowerProfile', payload, 1);
    try {
        if (response.ReturnCode === 0) {
            yield put(editFollowerTradingPolicySuccess(response));
        } else {
            yield put(editFollowerTradingPolicyFailure(response));
        }
    } catch (error) {
        yield put(editFollowerTradingPolicyFailure(error));
    }
}


/* Create Sagas method for Get Leader Configuration */
export function* getLeaderTradingPolicySagas() {
    yield takeEvery(GET_LEADER_TRADING_POLICY, getLeaderTradingPolicyAPI);
}

/* Create Sagas method for Edit Leader Configuration */
export function* editLeaderTradingPolicySagas() {
    yield takeEvery(EDIT_LEADER_TRADING_POLICY, editLeaderTradingPolicyAPI);
}

/* Create Sagas method for Get Follower Configuration */
export function* getFollowerTradingPolicySagas() {
    yield takeEvery(GET_FOLLOWER_TRADING_POLICY, getFollowerTradingPolicyAPI);
}

/* Create Sagas method for Edit Follower Configuration */
export function* editFollowerTradingPolicySagas() {
    yield takeEvery(EDIT_FOLLOWER_TRADING_POLICY, editFollowerTradingPolicyAPI);
}


/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getLeaderTradingPolicySagas),
        fork(editLeaderTradingPolicySagas),
        fork(getFollowerTradingPolicySagas),
        fork(editFollowerTradingPolicySagas),
    ]);
}