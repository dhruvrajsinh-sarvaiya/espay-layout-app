import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import { swaggerGetAPI, swaggerPostAPI } from "../../api/helper";
import {
    GET_TRANSACTION_POLICY, UPDATE_TRANSACTION_POLICY_STATUS,
    ADD_TRANSACTION_POLICY, UPDATE_TRANSACTION_POLICY,
} from "../../actions/ActionTypes";

import {
    //transaction policy list
    getTransactionPolicySuccess,
    getTransactionPolicyFailure,

    //update transaction policy status delete
    updateTransactionPolicyStatusSuccess,
    updateTransactionPolicyStatusFailure,

    //Add transaction policy 
    addTransactionPolicySuccess,
    addtransactionPolicyFailure,

    //update transaction policy 
    onUpdateTransactionPolicySuccess,
    onUpdateTransactionPolicyFail,
} from '../../actions/Wallet/TransactionPolicyAction';
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Methods";

//Get transaction policy list Api Call
function* getTransactionPolicyAPI() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Transactionpolicy List Data Api
        const response = yield call(swaggerGetAPI, Method.ListTransactionPolicy, {}, headers);

        // To set Transactionpolicy List success response to reducer
        yield put(getTransactionPolicySuccess(response));
    } catch (error) {
        // To set Transactionpolicy List failure response to reducer
        yield put(getTransactionPolicyFailure(error));
    }
}

//update transaction policy status Delete 
function* updateTransactionPolicyStatusAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }
        // To call Transactionpolicy delete Data Api
        const response = yield call(swaggerPostAPI, Method.ChangeTransactionPolicyStatus + '/' + payload.TrnPolicyId + "/" + payload.Status, payload, headers);

        // To set Transactionpolicy delete success response to reducer
        yield put(updateTransactionPolicyStatusSuccess(response));
    } catch (error) {
        // To set Transactionpolicy delete failure response to reducer
        yield put(updateTransactionPolicyStatusFailure(error));
    }
}

//Add transaction policy 
function* addTransactionPolicyAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Transactionpolicy add Data Api
        const response = yield call(swaggerPostAPI, Method.InsertTransactionPolicy, payload, headers);

        // To set Transactionpolicy add success response to reducer
        yield put(addTransactionPolicySuccess(response));
    }
    catch (error) {

        // To set Transactionpolicy add failure response to reducer
        yield put(addtransactionPolicyFailure(error));
    }
}

//update transaction policy 
function* updateTransactionPolicyAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Transactionpolicy update Data Api
        const response = yield call(swaggerPostAPI, Method.UpdateTransactionPolicy + '/' + payload.TrnPolicyId, payload, headers);

        // To set Transactionpolicy update success response to reducer
        yield put(onUpdateTransactionPolicySuccess(response));
    } catch (error) {

        // To set Transactionpolicy update failure response to reducer
        yield put(onUpdateTransactionPolicyFail(error));
    }
}

//for call transactionpolicy list api
function* getTransactionPolicy() {
    yield takeEvery(GET_TRANSACTION_POLICY, getTransactionPolicyAPI);
}

//for call delete transactionpolicy  api
function* updateTransactionPolicyStatus() {
    yield takeEvery(UPDATE_TRANSACTION_POLICY_STATUS, updateTransactionPolicyStatusAPI);
}

//for call add transactionpolicy  api
function* addTransactionPolicy() {
    yield takeEvery(ADD_TRANSACTION_POLICY, addTransactionPolicyAPI);
}
//for call update transactionpolicy  api
function* updateTransactionPolicy() {
    yield takeEvery(UPDATE_TRANSACTION_POLICY, updateTransactionPolicyAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getTransactionPolicy),
        fork(updateTransactionPolicyStatus),
        fork(addTransactionPolicy),
        fork(updateTransactionPolicy),
    ]);
}
