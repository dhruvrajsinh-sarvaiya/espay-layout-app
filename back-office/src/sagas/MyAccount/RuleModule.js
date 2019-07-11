/**
 * Auther : Salim Deraiya
 * Created : 20/02/2019
 * Updated by  : Bharat Jogrna, 25 FEB 2019, Saloni Rathod(11/03/2019)
 * Rule Module Sagas
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    ADD_RULE_MODULE,
    EDIT_RULE_MODULE,
    CHANGE_RULE_MODULE_STATUS,
    LIST_RULE_MODULE,
    GET_BY_ID_RULE_MODULE,
    LIST_RULE_MODULE_FOR_PARENTID //Added by Saloni Rathod
} from "Actions/types";

import {
    addRuleModuleSuccess,
    addRuleModuleFailure,
    editRuleModuleSuccess,
    editRuleModuleFailure,
    changeStatusRuleModuleSuccess,
    changeStatusRuleModuleFailure,
    getRuleModuleListSuccess,
    getRuleModuleListFailure,
    getRuleModuleByIdSuccess,
    getRuleModuleByIdFailure,
    getRuleModuleListForParentIdSuccess, //Added by Saloni Rathod
    getRuleModuleListForParentIdFailure, //Added by Saloni Rathod
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Function for Add Rule Module API
function* addRuleModuleAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeRuleManagement/AddModuleData', payload, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(addRuleModuleSuccess(response));
        } else {
            yield put(addRuleModuleFailure(response));
        }
    } catch (error) {
        yield put(addRuleModuleFailure(error));
    }
}

//Function for Edit Rule Module API
function* editRuleModuleAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeRuleManagement/UpdateModuleData', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(editRuleModuleSuccess(response));
        } else {
            yield put(editRuleModuleFailure(response));
        }
    } catch (error) {
        yield put(editRuleModuleFailure(error));
    }
}

//Function for List Rule Module API
function* listRuleModuleAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var sUrl = 'api/BackOfficeRuleManagement/GetAllModuleData/' + payload.PageNo + '?PageSize=' + payload.PageSize;
    if (payload.hasOwnProperty('AllRecords') && payload.AllRecords > 0) {
        sUrl += '&AllRecords=' + payload.AllRecords;
    }
    const response = yield call(swaggerGetAPI, sUrl, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getRuleModuleListSuccess(response));
        } else {
            yield put(getRuleModuleListFailure(response));
        }
    } catch (error) {
        yield put(getRuleModuleListFailure(error));
    }
}

//Function for Get By ID Rule Module API
function* getByIdRuleModuleAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackOfficeRuleManagement/GetModuleDataByID/' + payload.ID, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getRuleModuleByIdSuccess(response));
        } else {
            yield put(getRuleModuleByIdFailure(response));
        }
    } catch (error) {
        yield put(getRuleModuleByIdFailure(error));
    }
}

//Function for Change Status Rule Module API
function* changeStatusRuleModuleAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    // Added By Bharat Jograna
    const response = yield call(swaggerPostAPI, 'api/BackOfficeRuleManagement/ChangeStatusModuleData?id=' + payload.id + '&Status=' + payload.Status, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(changeStatusRuleModuleSuccess(response));
        } else {
            yield put(changeStatusRuleModuleFailure(response));
        }
    } catch (error) {
        yield put(changeStatusRuleModuleFailure(error));
    }
}

//Added by Saloni Rathod
//Function for List Rule Module for ParentID API
function* listRuleModuleForParentIdAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var response = yield call(swaggerGetAPI, 'api/BackOfficeRuleManagement/GetAllModuleData/' + payload.PageNo + '?PageSize=' + payload.PageSize + '&AllRecords=1&IsParentList=true', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getRuleModuleListForParentIdSuccess(response));
        } else {
            yield put(getRuleModuleListForParentIdFailure(response));
        }
    } catch (error) {
        yield put(getRuleModuleListForParentIdFailure(error));
    }
}

/* Create Sagas method for Add Rule Module */
export function* addRuleModuleSagas() {
    yield takeEvery(ADD_RULE_MODULE, addRuleModuleAPI);
}

/* Create Sagas method for Edit Rule Module */
export function* editRuleModuleSagas() {
    yield takeEvery(EDIT_RULE_MODULE, editRuleModuleAPI);
}

/* Create Sagas method for List Rule Module */
export function* listRuleModuleSagas() {
    yield takeEvery(LIST_RULE_MODULE, listRuleModuleAPI);
}

/* Create Sagas method for Get By ID Rule Module */
export function* getByIdRuleModuleSagas() {
    yield takeEvery(GET_BY_ID_RULE_MODULE, getByIdRuleModuleAPI);
}

/* Create Sagas method for Change Status Rule Module */
export function* changeStatusRuleModuleSagas() {
    yield takeEvery(CHANGE_RULE_MODULE_STATUS, changeStatusRuleModuleAPI);
}

//Added by Saloni Rathod
/* Create Sagas method for List Rule Module For ParentID */
export function* listRuleModuleForParentIdSagas() {
    yield takeEvery(LIST_RULE_MODULE_FOR_PARENTID, listRuleModuleForParentIdAPI);
}

export default function* rootSaga() {
    yield all([
        fork(addRuleModuleSagas),
        fork(editRuleModuleSagas),
        fork(listRuleModuleSagas),
        fork(getByIdRuleModuleSagas),
        fork(changeStatusRuleModuleSagas),
        fork(listRuleModuleForParentIdSagas), //Added by Saloni Rathod
    ]);
}