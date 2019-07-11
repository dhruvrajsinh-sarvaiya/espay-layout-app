import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { swaggerGetAPI, swaggerPostAPI, swaggerDeleteAPI, swaggerPutAPI } from 'Helpers/helpers';
import { GET_WALLET_TYPE_MASTER, DELETE_WALLET_TYPE_MASTER, ADD_WALLET_TYPE_MASTER, UPDATE_WALLET_TYPE_MASTER, GET_WALLET_TYPE_MASTER_BY_ID } from "Actions/types";
import {
    getWalletTypeMasterSuccess,
    getWalletTypeMasterFailure,
    deleteWalletTypeMasterSuccess,
    deleteWalletTypeMasterFailure,
    addWalletTypeMasterSuccess,
    addWalletTypeMasterFailure,
    onUpdateWalletTypeMasterSuccess,
    onUpdateWalletTypeMasterFail,
    getWalletTypeMasterByIdSuccess,
    getWalletTypeMasterByIdFailure
} from "Actions/WalletTypes";
import AppConfig from 'Constants/AppConfig';

function* getWalletTypeMasterAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletConfiguration/ListAllWalletTypeMaster', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getWalletTypeMasterSuccess(response));
        } else {
            yield put(getWalletTypeMasterFailure(response));
        }
    } catch (error) {
        yield put(getWalletTypeMasterFailure(error));
    }
}
function* getWalletTypeMasterByIdAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletConfiguration/GetWalletTypeMasterById/' + payload.id, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getWalletTypeMasterByIdSuccess(response));
        } else {
            yield put(getWalletTypeMasterByIdFailure(response));
        }
    } catch (error) {
        yield put(getWalletTypeMasterByIdFailure(error));
    }
}
function* deleteWalletTypeMasterAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerDeleteAPI, '/api/WalletConfiguration/DeleteWalletTypeMaster/' + payload.id, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(deleteWalletTypeMasterSuccess(response));
        } else {
            yield put(deleteWalletTypeMasterFailure(response));
        }
    } catch (error) {
        yield put(deleteWalletTypeMasterFailure(error));
    }
}
function* addWalletTypeMasterAPI({ payload }) {
    let reqObj = {
        WalletTypeName: payload.WalletTypeName,
        Description: payload.Description,
        IsDepositionAllow: parseFloat(payload.IsDepositionAllow),
        IsWithdrawalAllow: parseFloat(payload.IsWithdrawalAllow),
        IsTransactionWallet: parseFloat(payload.IsTransactionWallet),
        Status: parseFloat(payload.Status)
    };
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/WalletConfiguration/AddWalletTypeMaster', reqObj, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addWalletTypeMasterSuccess(response));
        } else {
            yield put(addWalletTypeMasterFailure(response));
        }
    } catch (error) {
        yield put(addWalletTypeMasterFailure(error));
    }
}
function* updateWalletTypeMasterAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPutAPI, '/api/WalletConfiguration/UpdateWalletTypeMaster/' + payload.id, payload.reqObj, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(onUpdateWalletTypeMasterSuccess(response));
        } else {
            yield put(onUpdateWalletTypeMasterFail(response));
        }
    } catch (error) {
        yield put(onUpdateWalletTypeMasterFail(error));
    }
}
function* getWalletTypeMaster() {
    yield takeEvery(GET_WALLET_TYPE_MASTER, getWalletTypeMasterAPI);
}
function* getWalletTypeMasterById() {
    yield takeEvery(GET_WALLET_TYPE_MASTER_BY_ID, getWalletTypeMasterByIdAPI);
}
function* deleteWalletTypeMaster() {
    yield takeEvery(DELETE_WALLET_TYPE_MASTER, deleteWalletTypeMasterAPI);
}
function* addWalletTypeMaster() {
    yield takeEvery(ADD_WALLET_TYPE_MASTER, addWalletTypeMasterAPI);
}
function* updateWalletTypeMaster() {
    yield takeEvery(UPDATE_WALLET_TYPE_MASTER, updateWalletTypeMasterAPI);
}
export default function* rootSaga() {
    yield all([
        fork(getWalletTypeMaster),
        fork(deleteWalletTypeMaster),
        fork(addWalletTypeMaster),
        fork(updateWalletTypeMaster),
        fork(getWalletTypeMasterById)
    ]);
}
