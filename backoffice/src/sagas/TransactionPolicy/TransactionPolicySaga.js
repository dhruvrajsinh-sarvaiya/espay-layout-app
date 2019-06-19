import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { swaggerGetAPI, swaggerPostAPI } from 'Helpers/helpers';
import { GET_TRANSACTION_POLICY, UPDATE_TRANSACTION_POLICY_STATUS, ADD_TRANSACTION_POLICY, UPDATE_TRANSACTION_POLICY, GET_WALLET_TRANSACTION_TYPE, GET_ROLE_DETAILS } from "Actions/types";
import {
    getTransactionPolicySuccess,
    getTransactionPolicyFailure,
    updateTransactionPolicyStatusSuccess,
    updateTransactionPolicyStatusFailure,
    addTransactionPolicySuccess,
    addtransactionPolicyFailure,
    onUpdateTransactionPolicySuccess,
    onUpdateTransactionPolicyFail,
    getWalletTransactionTypeSuccess,
    getWalletTransactionTypeFailure,
    getRoleDetailsSuccess,
    getRoleDetailsFailure
} from "Actions/TransactionPolicy";
import AppConfig from 'Constants/AppConfig';

function* getTransactionPolicyAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/ListTransactionPolicy', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getTransactionPolicySuccess(response));
        } else {
            yield put(getTransactionPolicyFailure(response));
        }
    } catch (error) {
        yield put(getTransactionPolicyFailure(error));
    }
}
function* updateTransactionPolicyStatusAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/WalletControlPanel/ChangeTransactionPolicyStatus/' + payload.id + "/" + payload.status, payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(updateTransactionPolicyStatusSuccess(response));
        } else {
            yield put(updateTransactionPolicyStatusFailure(response));
        }
    } catch (error) {
        yield put(updateTransactionPolicyStatusFailure(error));
    }
}
function* addTransactionPolicyAPI({ payload }) {
    let reqObj = {
        AllowedIP: payload.AllowedIP,
        AllowedLocation: payload.AllowedLocation,
        AllowedUserType: parseFloat(payload.AllowedUserType),
        AuthenticationType: parseFloat(payload.AuthenticationType),
        AuthorityType: parseFloat(payload.AuthorityType),
        DailyTrnAmount: parseFloat(payload.DailyTrnAmount),
        DailyTrnCount: parseFloat(payload.DailyTrnCount),
        EndTime: parseFloat(payload.EndTime),
        MaxAmount: parseFloat(payload.MaxAmount),
        MinAmount: parseFloat(payload.MinAmount),
        MonthlyTrnAmount: parseFloat(payload.MonthlyTrnAmount),
        MonthlyTrnCount: parseFloat(payload.MonthlyTrnCount),
        StartTime: parseFloat(payload.StartTime),
        Status: parseInt(payload.Status),
        TrnType: parseFloat(payload.TrnType),
        RoleId: parseFloat(payload.RoleId),
        WeeklyTrnAmount: parseFloat(payload.WeeklyTrnAmount),
        WeeklyTrnCount: parseFloat(payload.WeeklyTrnCount),
        YearlyTrnAmount: parseFloat(payload.YearlyTrnAmount),
        YearlyTrnCount: parseFloat(payload.YearlyTrnCount),
        IsKYCEnable: parseInt(payload.IsKYCEnable),
    };
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/WalletControlPanel/InsertTransactionPolicy', reqObj, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addTransactionPolicySuccess(response));
        } else {
            yield put(addtransactionPolicyFailure(response));
        }
    } catch (error) {
        yield put(addtransactionPolicyFailure(error));
    }
}
function* updateTransactionPolicyAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/WalletControlPanel/UpdateTransactionPolicy/' + payload.id, payload.reqObj, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(onUpdateTransactionPolicySuccess(response));
        } else {
            yield put(onUpdateTransactionPolicyFail(response));
        }
    } catch (error) {
        yield put(onUpdateTransactionPolicyFail(error));
    }
}
function* getWalletTransactionTypeAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/ListWalletTrnType', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getWalletTransactionTypeSuccess(response.Data));
        } else {
            yield put(getWalletTransactionTypeFailure(response));
        }
    } catch (error) {
        yield put(getWalletTransactionTypeFailure(error));
    }
}
function* getRoleDetailsAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/ListRoleDetails', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getRoleDetailsSuccess(response));
        } else {
            yield put(getRoleDetailsFailure(response));
        }
    } catch (error) {
        yield put(getRoleDetailsFailure(error));
    }
}
function* geRoleDetails() {
    yield takeEvery(GET_ROLE_DETAILS, getRoleDetailsAPI);
}
function* getWalletTransactionType() {
    yield takeEvery(GET_WALLET_TRANSACTION_TYPE, getWalletTransactionTypeAPI);
}
function* getTransactionPolicy() {
    yield takeEvery(GET_TRANSACTION_POLICY, getTransactionPolicyAPI);
}
function* updateTransactionPolicyStatus() {
    yield takeEvery(UPDATE_TRANSACTION_POLICY_STATUS, updateTransactionPolicyStatusAPI);
}
function* addTransactionPolicy() {
    yield takeEvery(ADD_TRANSACTION_POLICY, addTransactionPolicyAPI);
}
function* updateTransactionPolicy() {
    yield takeEvery(UPDATE_TRANSACTION_POLICY, updateTransactionPolicyAPI);
}
export default function* rootSaga() {
    yield all([
        fork(getTransactionPolicy),
        fork(updateTransactionPolicyStatus),
        fork(addTransactionPolicy),
        fork(updateTransactionPolicy),
        fork(getWalletTransactionType),
        fork(geRoleDetails)
    ]);
}
