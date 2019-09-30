import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { swaggerGetAPI, swaggerPostAPI } from '../../api/helper';
import { getLeaderTradingPolicySuccess, getLeaderTradingPolicyFailure, getFollowerTradingPolicySuccess, getFollowerTradingPolicyFailure, editLeaderTradingPolicySuccess, editLeaderTradingPolicyFailure, editFollowerTradingPolicySuccess, editFollowerTradingPolicyFailure } from '../../actions/account/SocialTradingPolicyActions';
import { GET_LEADER_TRADING_POLICY, GET_FOLLOWER_TRADING_POLICY, EDIT_LEADER_TRADING_POLICY, EDIT_FOLLOWER_TRADING_POLICY } from '../../actions/ActionTypes';
import { Method } from '../../controllers/Constants';
import { userAccessToken } from '../../selector';

export default function* SocialTradingPolicySaga() {
    yield takeEvery(GET_LEADER_TRADING_POLICY, getLedgerTradingPolicy);
    yield takeEvery(GET_FOLLOWER_TRADING_POLICY, getFollowerTradingPolicy);
    yield takeEvery(EDIT_LEADER_TRADING_POLICY, editLedgerTradingPolicy);
    yield takeEvery(EDIT_FOLLOWER_TRADING_POLICY, editFollowerTradingPolicy);
}

// Generator for Social Ledger Trading Policy 
function* getLedgerTradingPolicy({ payload }) {
    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }
        
        const data = yield call(swaggerGetAPI, Method.GetLeaderProfile, {}, headers);
        yield put(getLeaderTradingPolicySuccess(data));

    } catch (error) {
        yield put(getLeaderTradingPolicyFailure());
    }
}

// Generator for Edit Social Follower Trading Policy 
function* editLedgerTradingPolicy({ payload }) {
    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        const data = yield call(swaggerPostAPI, Method.SetLeaderProfile, payload, headers);
        yield put(editLeaderTradingPolicySuccess(data));

    } catch (error) {
        yield put(editLeaderTradingPolicyFailure());
    }
}

// Generator for Social Follower Trading Policy 
function* getFollowerTradingPolicy({ payload }) {
    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        const data = yield call(swaggerGetAPI, Method.GetFollowerProfile, {}, headers);
        yield put(getFollowerTradingPolicySuccess(data));

    } catch (error) {
        yield put(getFollowerTradingPolicyFailure());
    }
}

// Generator for Edit Social Follower Trading Policy 
function* editFollowerTradingPolicy({ payload }) {
    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        const data = yield call(swaggerPostAPI, Method.SetFollowerProfile, payload, headers);
        yield put(editFollowerTradingPolicySuccess(data));

    } catch (error) {
        yield put(editFollowerTradingPolicyFailure());
    }
}
