import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import { swaggerGetAPI, swaggerPostAPI } from "../../api/helper";
import { GET_WALLET_USAGE_POLICY, UPDATE_WALLET_USAGE_POLICY_STATUS, ADD_WALLET_USAGE_POLICY, UPDATE_WALLET_USAGE_POLICY, } from "../../actions/ActionTypes";

import {
    //Wallet Usage policy list
    getWalletUsagePolicySuccess,
    getWalletUsagePolicyFailure,
    //update Wallet Usage policy status delete
    updateWalletUsagePolicyStatusSuccess,
    updateWalletUsagePolicyStatusFailure,
    //Add Wallet Usage policy 
    addWalletUsagePolicySuccess,
    addWalletUsagePolicyFailure,
    //update Wallet Usage policy 
    onUpdateWalletUsagePolicySuccess,
    onUpdateWalletUsagePolicyFail,
} from '../../actions/Wallet/WalletUsagePolicyAction';
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Methods";

//Get Wallet Usage policy list Api Call
function* getWalletUsagePolicyAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }
        // To call Wallet Usage List Data Api
        const response = yield call(swaggerGetAPI, Method.ListUsagePolicy, {}, headers);
        // To set Wallet Usage List success response to reducer 
        yield put(getWalletUsagePolicySuccess(response));
    }
    catch (error) {
        // To set Wallet Usage List failure response to reducer
        yield put(getWalletUsagePolicyFailure(error));
    }
}

//update Wallet Usage policy status Delete 
function* updateWalletUsagePolicyStatusAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }
        // To call Wallet Usage delete Data Api
        const response = yield call(swaggerPostAPI, Method.ChangeWalletUsagePolicyStatus + '/' + payload.id + "/" + payload.status, payload, headers);

        // To set Wallet Usage delete success response to reducer
        yield put(updateWalletUsagePolicyStatusSuccess(response));
    } catch (error) {
        // To set Wallet Usage delete failure response to reducer
        yield put(updateWalletUsagePolicyStatusFailure(error));
    }
}

//Add Wallet Usage policy 
function* addWalletUsagePolicyAPI({ payload }) {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call Wallet Usage add Data Api
    const response = yield call(swaggerPostAPI, Method.InsertUpdateWalletUsagePolicy, payload, headers);
    try {
        // To set Wallet Usage add success response to reducer
        yield put(addWalletUsagePolicySuccess(response));
    } catch (error) {
        // To set Wallet Usage add failure response to reducer 
        yield put(addWalletUsagePolicyFailure(error));
    }
}

//update Wallet Usage policy 
function* updateWalletUsagePolicyAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Wallet Usage update Data Api
        const response = yield call(swaggerPostAPI, Method.InsertUpdateWalletUsagePolicy, payload, headers);

        // To set Wallet Usage update success response to reducer
        yield put(onUpdateWalletUsagePolicySuccess(response));
    } catch (error) {
        // To set Wallet Usage update failure response to reducer
        yield put(onUpdateWalletUsagePolicyFail(error));
    }
}

//for call Wallet Usage list api
function* getWalletUsagePolicy() {
    yield takeEvery(GET_WALLET_USAGE_POLICY, getWalletUsagePolicyAPI);
}

//for call delete Wallet Usage  api
function* updateWalletUsagePolicyStatus() {
    yield takeEvery(UPDATE_WALLET_USAGE_POLICY_STATUS, updateWalletUsagePolicyStatusAPI);
}

//for call add Wallet Usage  api
function* addWalletUsagePolicy() {
    yield takeEvery(ADD_WALLET_USAGE_POLICY, addWalletUsagePolicyAPI);
}

//for call update Wallet Usage  api
function* updateWalletUsagePolicy() {
    yield takeEvery(UPDATE_WALLET_USAGE_POLICY, updateWalletUsagePolicyAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getWalletUsagePolicy),
        fork(updateWalletUsagePolicyStatus),
        fork(addWalletUsagePolicy),
        fork(updateWalletUsagePolicy),
    ]);
}
