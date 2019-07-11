/**
 * Auther : Saloni Rathod
 * Created : 25/02/2019
 * Rule Field Sagas
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { 
    ADD_RULE_FIELD,
    EDIT_RULE_FIELD,
    CHANGE_RULE_FIELD_STATUS,
    LIST_RULE_FIELD,
    GET_BY_ID_RULE_FIELD
} from "Actions/types";

import { 
    addRuleFieldSuccess,
    addRuleFieldFailure,
    editRuleFieldSuccess,
    editRuleFieldFailure,
    changeStatusRuleFieldSuccess,
    changeStatusRuleFieldFailure,
    getRuleFieldListSuccess,
    getRuleFieldListFailure,
    getRuleFieldByIdSuccess,
    getRuleFieldByIdFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Function for Add Rule Field API
function* addRuleFieldAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeRuleManagement/AddFieldData', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addRuleFieldSuccess(response));
        } else {
            yield put(addRuleFieldFailure(response));
        }
    } catch (error) {
        yield put(addRuleFieldFailure(error));
    }
}

//Function for Edit Rule Field API
function* editRuleFieldAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeRuleManagement/UpdateFieldData', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(editRuleFieldSuccess(response));
        } else {
            yield put(editRuleFieldFailure(response));
        }
    } catch (error) {
        yield put(editRuleFieldFailure(error));
    }
}

//Function for List Rule Field API
function* listRuleFieldAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var sUrl = 'api/BackOfficeRuleManagement/GetAllFieldData/'+payload.PageNo+'?PageSize='+payload.PageSize;
    if(payload.hasOwnProperty('AllRecords') && payload.AllRecords > 0) {
        sUrl += '&AllRecords='+payload.AllRecords;
    }
    const response = yield call(swaggerGetAPI, sUrl, {}, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(getRuleFieldListSuccess(response));
        } else {
            yield put(getRuleFieldListFailure(response));
        }
    } catch (error) {
        yield put(getRuleFieldListFailure(error));
    }
}

//Function for Get By ID Rule Field API
function* getByIdRuleFieldAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackOfficeRuleManagement/GetFieldDataByID/'+payload.ID, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getRuleFieldByIdSuccess(response));
        } else {
            yield put(getRuleFieldByIdFailure(response));
        }
    } catch (error) {
        yield put(getRuleFieldByIdFailure(error));
    }
}

//Function for Change Status Rule Field API
function* changeStatusRuleFieldAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeRuleManagement/ChangeStatusFieldData?id='+payload.Id+'&Status='+payload.Status, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(changeStatusRuleFieldSuccess(response));
        } else {
            yield put(changeStatusRuleFieldFailure(response));
        }
    } catch (error) {
        yield put(changeStatusRuleFieldFailure(error));
    }
}

/* Create Sagas method for Add Rule Field */
export function* addRuleFieldSagas() {
    yield takeEvery(ADD_RULE_FIELD, addRuleFieldAPI);
}

/* Create Sagas method for Edit Rule Field */
export function* editRuleFieldSagas() {
    yield takeEvery(EDIT_RULE_FIELD, editRuleFieldAPI);
}

/* Create Sagas method for List Rule Field */
export function* listRuleFieldSagas() {
    yield takeEvery(LIST_RULE_FIELD, listRuleFieldAPI);
}

/* Create Sagas method for Get By ID Rule Field */
export function* getByIdRuleFieldSagas() {
    yield takeEvery(GET_BY_ID_RULE_FIELD, getByIdRuleFieldAPI);
}

/* Create Sagas method for Change Status Rule Field */
export function* changeStatusRuleFieldSagas() {
    yield takeEvery(CHANGE_RULE_FIELD_STATUS, changeStatusRuleFieldAPI);
}

export default function* rootSaga() {
    yield all([
        fork(addRuleFieldSagas),
        fork(editRuleFieldSagas),
        fork(listRuleFieldSagas),
        fork(getByIdRuleFieldSagas),
        fork(changeStatusRuleFieldSagas),
    ]);
}