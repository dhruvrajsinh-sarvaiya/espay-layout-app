import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { swaggerGetAPI, swaggerPostAPI } from 'Helpers/helpers';

import { GET_COMMISSION_TYPE_DETAIL, UPDATE_COMMISSION_TYPE_STATUS, ADD_COMMISSION_TYPE, UPDATE_COMMISSION_TYPE } from "Actions/types";

import {
    getCommissionTypeSuccess,
    getCommissionTypeFailure,
    updateCommissionTypeStatusSuccess,
    updateCommissionTypeStatusFailure,
    addCommissionTypeSuccess,
    addCommissionTypeFailure,
    onUpdateCommissionTypeSuccess,
    onUpdateCommissionTypeFail
} from "Actions/CommisssionType";

import AppConfig from 'Constants/AppConfig';

function* getCommissionTypeAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/ListCommisssionTypeDetail', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getCommissionTypeSuccess(response));
        } else {
            yield put(getCommissionTypeFailure(response));
        }
    } catch (error) {
        yield put(getCommissionTypeFailure(error));
    }
}

function* updateCommissionTypeStatusAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/WalletControlPanel/ChangeCommisssionTypeReqStatus/' + payload.id + "/" + payload.status, payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(updateCommissionTypeStatusSuccess(response));
        } else {
            yield put(updateCommissionTypeStatusFailure(response));
        }
    } catch (error) {
        yield put(updateCommissionTypeStatusFailure(error));
    }
}

function* addCommissionTypeAPI({ payload }) {
    let reqObj = {
        Id: parseFloat(payload.Id),
        TypeId: parseFloat(payload.TypeId),
        TypeName: payload.TypeName,
        Status: parseFloat(payload.Status)
    };
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/WalletControlPanel/InsertUpdateCommisssionType', reqObj, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addCommissionTypeSuccess(response));
        } else {
            yield put(addCommissionTypeFailure(response));
        }
    } catch (error) {
        yield put(addCommissionTypeFailure(error));
    }
}

function* updateCommissionTypeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/WalletControlPanel/InsertUpdateCommisssionType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(onUpdateCommissionTypeSuccess(response));
        } else {
            yield put(onUpdateCommissionTypeFail(response));
        }
    } catch (error) {
        yield put(onUpdateCommissionTypeFail(error));
    }
}


function* getCommissionTypeDetail() {
    yield takeEvery(GET_COMMISSION_TYPE_DETAIL, getCommissionTypeAPI);
}

function* updateCommissionTypeStatus() {
    yield takeEvery(UPDATE_COMMISSION_TYPE_STATUS, updateCommissionTypeStatusAPI);
}

function* addCommissionType() {
    yield takeEvery(ADD_COMMISSION_TYPE, addCommissionTypeAPI);
}

function* updateCommissionType() {
    yield takeEvery(UPDATE_COMMISSION_TYPE, updateCommissionTypeAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getCommissionTypeDetail),
        fork(updateCommissionTypeStatus),
        fork(addCommissionType),
        fork(updateCommissionType)
    ]);
}
