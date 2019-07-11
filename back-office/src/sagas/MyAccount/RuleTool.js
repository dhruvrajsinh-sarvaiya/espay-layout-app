/**
 * Auther : Salim Deraiya
 * Created : 20/02/2019
 * Updated by  : Bharat Jogrna, 25 FEB 2019
 * Rule Tool Sagas
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { 
    ADD_RULE_TOOL,
    EDIT_RULE_TOOL,
    CHANGE_RULE_TOOL_STATUS,
    LIST_RULE_TOOL,
    GET_BY_ID_RULE_TOOL
} from "Actions/types";

import { 
    addRuleToolSuccess,
    addRuleToolFailure,
    editRuleToolSuccess,
    editRuleToolFailure,
    changeStatusRuleToolSuccess,
    changeStatusRuleToolFailure,
    getRuleToolListSuccess,
    getRuleToolListFailure,
    getRuleToolByIdSuccess,
    getRuleToolByIdFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Function for Add Rule Tool API
function* addRuleToolAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeRuleManagement/AddToolData', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addRuleToolSuccess(response));
        } else {
            yield put(addRuleToolFailure(response));
        }
    } catch (error) {
        yield put(addRuleToolFailure(error));
    }
}

//Function for Edit Rule Tool API
function* editRuleToolAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeRuleManagement/UpdateToolData', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(editRuleToolSuccess(response));
        } else {
            yield put(editRuleToolFailure(response));
        }
    } catch (error) {
        yield put(editRuleToolFailure(error));
    }
}

//Function for List Rule Tool API
function* listRuleToolAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var sUrl = 'api/BackOfficeRuleManagement/GetAllToolData/'+payload.PageNo+'?PageSize='+payload.PageSize;
    if(payload.hasOwnProperty('AllRecords') && payload.AllRecords > 0) {
        sUrl += '&AllRecords='+payload.AllRecords;
    }
    const response = yield call(swaggerGetAPI, sUrl, {}, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(getRuleToolListSuccess(response));
        } else {
            yield put(getRuleToolListFailure(response));
        }
    } catch (error) {
        yield put(getRuleToolListFailure(error));
    }
}

//Function for Get By ID Rule Tool API
function* getByIdRuleToolAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackOfficeRuleManagement/GetToolDataByID/'+payload.ID, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getRuleToolByIdSuccess(response));
        } else {
            yield put(getRuleToolByIdFailure(response));
        }
    } catch (error) {
        yield put(getRuleToolByIdFailure(error));
    }
}

//Function for Change Status Rule Tool API
function* changeStatusRuleToolAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    // Added By Bharat Jograna
    const response = yield call(swaggerPostAPI, 'api/BackOfficeRuleManagement/ChangeStatusToolData?id=' + payload.id + '&Status=' + payload.Status, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(changeStatusRuleToolSuccess(response));
        } else {
            yield put(changeStatusRuleToolFailure(response));
        }
    } catch (error) {
        yield put(changeStatusRuleToolFailure(error));
    }
}

/* Create Sagas method for Add Rule Tool */
export function* addRuleToolSagas() {
    yield takeEvery(ADD_RULE_TOOL, addRuleToolAPI);
}

/* Create Sagas method for Edit Rule Tool */
export function* editRuleToolSagas() {
    yield takeEvery(EDIT_RULE_TOOL, editRuleToolAPI);
}

/* Create Sagas method for List Rule Tool */
export function* listRuleToolSagas() {
    yield takeEvery(LIST_RULE_TOOL, listRuleToolAPI);
}

/* Create Sagas method for Get By ID Rule Tool */
export function* getByIdRuleToolSagas() {
    yield takeEvery(GET_BY_ID_RULE_TOOL, getByIdRuleToolAPI);
}

/* Create Sagas method for Change Status Rule Tool */
export function* changeStatusRuleToolSagas() {
    yield takeEvery(CHANGE_RULE_TOOL_STATUS, changeStatusRuleToolAPI);
}

export default function* rootSaga() {
    yield all([
        fork(addRuleToolSagas),
        fork(editRuleToolSagas),
        fork(listRuleToolSagas),
        fork(getByIdRuleToolSagas),
        fork(changeStatusRuleToolSagas),
    ]);
}