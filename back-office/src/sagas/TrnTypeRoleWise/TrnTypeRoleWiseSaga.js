/*
Saga : TrnType Role Wise 
Created By : Sanjay Rathod
Date : 02/01/2019
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { swaggerGetAPI, swaggerPostAPI } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    GET_TRNTYPE_ROLEWISE,
    UPDATE_TRNTYPE_ROLEWISE_STATUS,
    ADD_TRNTYPE_ROLEWISE
} from "Actions/types";
import {
    getTrnTypeRoleWiseSuccess,
    getTrnTypeRoleWiseFailure,
    updateTrnTypeRoleWiseStatusSuccess,
    updateTrnTypeRoleWiseStatusFailure,
    addTrnTypeRoleWiseSuccess,
    addTrnTypeRoleWiseFailure
} from "Actions/TrnTypeRoleWise";

//Get Trn Type Role Wise Api Call 
function* getTrnTypeRoleWiseAPI(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/ListAllowTrnTypeRoleWise' + '?';
    if (request.hasOwnProperty("RoleId") && request.RoleId !== "") {
        URL += '&RoleId=' + request.RoleId;
    }
    if (request.hasOwnProperty("TrnTypeId") && request.TrnTypeId !== "") {
        URL += '&TrnTypeId=' + request.TrnTypeId;
    }
    if (request.hasOwnProperty("Status") && request.Status !== "") {
        URL += '&Status=' + request.Status;
    }
    const response = yield call(swaggerGetAPI, URL, payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getTrnTypeRoleWiseSuccess(response));
        } else {
            yield put(getTrnTypeRoleWiseFailure(response));
        }
    } catch (error) {
        yield put(getTrnTypeRoleWiseFailure(error));
    }
}
//Update Trn Type Role Wise Status Api Call 
function* updateTrnTypeRoleWiseStatusAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/WalletControlPanel/ChangeAllowTrnTypeRoleStatus/' + payload.id + "/" + payload.status, payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(updateTrnTypeRoleWiseStatusSuccess(response));
        } else {
            yield put(updateTrnTypeRoleWiseStatusFailure(response));
        }
    } catch (error) {
        yield put(updateTrnTypeRoleWiseStatusFailure(error));
    }
}
//Trn Type Role Wise call api for add 
function* addTrnTypeRoleWiseAPI({ payload }) {
    let reqObj = {
        RoleId: parseFloat(payload.RoleId),
        TrnTypeId: parseFloat(payload.TrnTypeId),
        Status: parseFloat(payload.Status)
    };
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/WalletControlPanel/InserUpdateAllowTrnTypeRole', reqObj, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addTrnTypeRoleWiseSuccess(response));
        } else {
            yield put(addTrnTypeRoleWiseFailure(response));
        }
    } catch (error) {
        yield put(addTrnTypeRoleWiseFailure(error));
    }
}
function* getTrnTypeRoleWise() {
    yield takeEvery(GET_TRNTYPE_ROLEWISE, getTrnTypeRoleWiseAPI);
}
function* updateTrnTypeRoleWiseStatus() {
    yield takeEvery(UPDATE_TRNTYPE_ROLEWISE_STATUS, updateTrnTypeRoleWiseStatusAPI);
}
function* addTrnTypeRoleWise() {
    yield takeEvery(ADD_TRNTYPE_ROLEWISE, addTrnTypeRoleWiseAPI);
}
export default function* rootSaga() {
    yield all([
        fork(getTrnTypeRoleWise),
        fork(updateTrnTypeRoleWiseStatus),
        fork(addTrnTypeRoleWise)
    ]);
}
