/**
 * Auther : Salim Deraiya
 * Created : 20/02/2019
 * Updated by  : Bharat Jogrna, 25 FEB 2019, Saloni Rathod(11/03/2019)
 * Rule Sub Module Sagas
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { 
    ADD_RULE_SUB_MODULE,
    EDIT_RULE_SUB_MODULE,
    CHANGE_RULE_SUB_MODULE_STATUS,
    LIST_RULE_SUB_MODULE,
    GET_BY_ID_RULE_SUB_MODULE,
    LIST_RULE_SUB_MODULE_FOR_PARENTID //Added by Saloni Rathod
} from "Actions/types";

import { 
    addRuleSubModuleSuccess,
    addRuleSubModuleFailure,
    editRuleSubModuleSuccess,
    editRuleSubModuleFailure,
    changeStatusRuleSubModuleSuccess,
    changeStatusRuleSubModuleFailure,
    getRuleSubModuleListSuccess,
    getRuleSubModuleListFailure,
    getRuleSubModuleByIdSuccess,
    getRuleSubModuleByIdFailure,
    getRuleSubModuleListForParentIdSuccess, //Added by Saloni Rathod
    getRuleSubModuleListForParentIdFailure, //Added by Saloni Rathod
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Function for Add Rule Sub Module API
function* addRuleSubModuleAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeRuleManagement/AddSubModuleData', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addRuleSubModuleSuccess(response));
        } else {
            yield put(addRuleSubModuleFailure(response));
        }
    } catch (error) {
        yield put(addRuleSubModuleFailure(error));
    }
}

//Function for Edit Rule Sub Module API
function* editRuleSubModuleAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeRuleManagement/UpdateSubModuleData', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(editRuleSubModuleSuccess(response));
        } else {
            yield put(editRuleSubModuleFailure(response));
        }
    } catch (error) {
        yield put(editRuleSubModuleFailure(error));
    }
}

//Function for List Rule Sub Module API
function* listRuleSubModuleAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var sUrl = 'api/BackOfficeRuleManagement/GetAllSubModuleData/'+payload.PageNo+'?PageSize='+payload.PageSize;
    if(payload.hasOwnProperty('AllRecords') && payload.AllRecords > 0) {
        sUrl += '&AllRecords='+payload.AllRecords;
    }
    const response = yield call(swaggerGetAPI, sUrl, {}, headers);
    
    try {
        if (response.ReturnCode === 0) {
            yield put(getRuleSubModuleListSuccess(response));
        } else {
            yield put(getRuleSubModuleListFailure(response));
        }
    } catch (error) {
        yield put(getRuleSubModuleListFailure(error));
    }
}

//Function for Get By ID Rule Sub Module API
function* getByIdRuleSubModuleAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackOfficeRuleManagement/GetSubModuleDataByID/'+payload.ID, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getRuleSubModuleByIdSuccess(response));
        } else {
            yield put(getRuleSubModuleByIdFailure(response));
        }
    } catch (error) {
        yield put(getRuleSubModuleByIdFailure(error));
    }
}

//Function for Change Status Rule Sub Module API
function* changeStatusRuleSubModuleAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    // Added By Bharat Jograna
    const response = yield call(swaggerPostAPI, 'api/BackOfficeRuleManagement/ChangeStatusSubModuleData?id=' + payload.id + '&Status=' + payload.Status, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(changeStatusRuleSubModuleSuccess(response));
        } else {
            yield put(changeStatusRuleSubModuleFailure(response));
        }
    } catch (error) {
        yield put(changeStatusRuleSubModuleFailure(error));
    }
}

//Added by Saloni Rathod
//Function for List Rule Sub Module API For ParentId
function* listRuleSubModuleForParentIdAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerGetAPI, 'api/BackOfficeRuleManagement/GetAllSubModuleData/' + payload.PageNo + '?PageSize=' + payload.PageSize + '&AllRecords=1&IsParentList=true', {}, headers);
    const response = yield call(swaggerGetAPI, 'api/BackOfficeRuleManagement/GetAllSubModuleData/' + payload.PageNo + '?PageSize=' + payload.PageSize + '&AllRecords=0&IsParentList=true', {}, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(getRuleSubModuleListForParentIdSuccess(response));
        } else {
            yield put(getRuleSubModuleListForParentIdFailure(response));
        }
    } catch (error) {
        yield put(getRuleSubModuleListForParentIdFailure(error));
    }
}

/* Create Sagas method for Add Rule Sub Module */
export function* addRuleSubModuleSagas() {
    yield takeEvery(ADD_RULE_SUB_MODULE, addRuleSubModuleAPI);
}

/* Create Sagas method for Edit Rule Sub Module */
export function* editRuleSubModuleSagas() {
    yield takeEvery(EDIT_RULE_SUB_MODULE, editRuleSubModuleAPI);
}

/* Create Sagas method for List Rule Sub Module */
export function* listRuleSubModuleSagas() {
    yield takeEvery(LIST_RULE_SUB_MODULE, listRuleSubModuleAPI);
}

/* Create Sagas method for Get By ID Rule Sub Module */
export function* getByIdRuleSubModuleSagas() {
    yield takeEvery(GET_BY_ID_RULE_SUB_MODULE, getByIdRuleSubModuleAPI);
}

/* Create Sagas method for Change Status Rule Sub Module */
export function* changeStatusRuleSubModuleSagas() {
    yield takeEvery(CHANGE_RULE_SUB_MODULE_STATUS, changeStatusRuleSubModuleAPI);
}

//Added by Saloni Rathod
/* Create Sagas method for List Rule Sub Module For ParentId */
export function* listRuleSubModuleForParentIdSagas() {
    yield takeEvery(LIST_RULE_SUB_MODULE_FOR_PARENTID, listRuleSubModuleForParentIdAPI);
}

export default function* rootSaga() {
    yield all([
        fork(addRuleSubModuleSagas),
        fork(editRuleSubModuleSagas),
        fork(listRuleSubModuleSagas),
        fork(getByIdRuleSubModuleSagas),
        fork(changeStatusRuleSubModuleSagas),
        fork(listRuleSubModuleForParentIdSagas), //Added by Saloni Rathod
    ]);
}