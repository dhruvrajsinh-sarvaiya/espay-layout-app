import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { swaggerGetAPI, swaggerPostAPI } from 'Helpers/helpers';

import { GET_CHARGE_TYPE_DETAIL, UPDATE_CHARGE_TYPE_STATUS, ADD_CHARGE_TYPE, UPDATE_CHARGE_TYPE } from "Actions/types";

import {
    getChargeTypeSuccess,
    getChargeTypeFailure,
    updateChargeTypeStatusSuccess,
    updateChargeTypeStatusFailure,
    addChargeTypeSuccess,
    addChargeTypeFailure,
    onUpdateChargeTypeSuccess,
    onUpdateChargeTypeFail
} from "Actions/ChargeTypeDetail";

import AppConfig from 'Constants/AppConfig';

function* getChargeTypeAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/ListChargeTypeDetail', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getChargeTypeSuccess(response));
        } else {
            yield put(getChargeTypeFailure(response));
        }
    } catch (error) {
        yield put(getChargeTypeFailure(error));
    }
}

function* updateChargeTypeStatusAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/WalletControlPanel/ChangeChargeTypeStatus/' + payload.id + "/" + payload.status, payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(updateChargeTypeStatusSuccess(response));
        } else {
            yield put(updateChargeTypeStatusFailure(response));
        }
    } catch (error) {
        yield put(updateChargeTypeStatusFailure(error));
    }
}

function* addChargeTypeAPI({ payload }) {
    let reqObj = {
        TypeId: parseFloat(payload.TypeId),
        TypeName: payload.TypeName,
        Status: parseFloat(payload.Status)
    };
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/WalletControlPanel/InsertUpdateChargeType', reqObj, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addChargeTypeSuccess(response));
        } else {
            yield put(addChargeTypeFailure(response));
        }
    } catch (error) {
        yield put(addChargeTypeFailure(error));
    }
}

function* updateChargeTypeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/WalletControlPanel/InsertUpdateChargeType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(onUpdateChargeTypeSuccess(response));
        } else {
            yield put(onUpdateChargeTypeFail(response));
        }
    } catch (error) {
        yield put(onUpdateChargeTypeFail(error));
    }
}


function* getChargeTypeDetail() {
    yield takeEvery(GET_CHARGE_TYPE_DETAIL, getChargeTypeAPI);
}

function* updateChargeTypeStatus() {
    yield takeEvery(UPDATE_CHARGE_TYPE_STATUS, updateChargeTypeStatusAPI);
}

function* addChargeType() {
    yield takeEvery(ADD_CHARGE_TYPE, addChargeTypeAPI);
}

function* updateChargeType() {
    yield takeEvery(UPDATE_CHARGE_TYPE, updateChargeTypeAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getChargeTypeDetail),
        fork(updateChargeTypeStatus),
        fork(addChargeType),
        fork(updateChargeType)
    ]);
}
