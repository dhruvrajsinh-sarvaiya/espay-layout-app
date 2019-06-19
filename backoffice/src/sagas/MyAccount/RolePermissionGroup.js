/**
 * Auther : Salim Deraiya
 * Created : 22/02/2019
 * Role Permission Group Sagas
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { 
    ADD_ROLE_PERMISSION_GROUP,
    EDIT_ROLE_PERMISSION_GROUP,
    CHANGE_ROLE_PERMISSION_GROUP_STATUS,
    LIST_ROLE_PERMISSION_GROUP,
    GET_BY_ID_ROLE_PERMISSION_GROUP,
    GET_CONFIGURATION_ROLE_PERMISSION_GROUP,
    GET_CONFIGURATION_ROLE_PERMISSION_GROUP_BY_ID
} from "Actions/types";

import { 
    addRolePermissionGroupSuccess,
    addRolePermissionGroupFailure,
    editRolePermissionGroupSuccess,
    editRolePermissionGroupFailure,
    changeStatusRolePermissionGroupSuccess,
    changeStatusRolePermissionGroupFailure,
    getRolePermissionGroupListSuccess,
    getRolePermissionGroupListFailure,
    getRolePermissionGroupByIdSuccess,
    getRolePermissionGroupByIdFailure,
    getConfigurationRolePermissionGroupSuccess,
    getConfigurationRolePermissionGroupFailure,
    getConfigurationRolePermissionGroupByIdSuccess,
    getConfigurationRolePermissionGroupByIdFailure
} from "Actions/MyAccount";
import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Function for Add Role Permission Group API
function* addRolePermissionGroupAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/CreatePermissionGroup', payload, headers);
    const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/CreateGroup', payload, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(addRolePermissionGroupSuccess(response));
        } else {
            yield put(addRolePermissionGroupFailure(response));
        }
    } catch (error) {
        yield put(addRolePermissionGroupFailure(error));
    }
}

//Function for Edit Role Permission Group API
function* editRolePermissionGroupAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/UpdatePermissionGroup', payload, headers);
    const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/UpdateGroup', payload, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(editRolePermissionGroupSuccess(response));
        } else {
            yield put(editRolePermissionGroupFailure(response));
        }
    } catch (error) {
        yield put(editRolePermissionGroupFailure(error));
    }
}

//Function for List Role Permission Group API
function* getRolePermissionGroupListAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerGetAPI, 'api/BackofficeRoleManagement/ListPermissionGroup/'+payload.PageNo+'?PageSize='+payload.PageSize, {}, headers);
    const response = yield call(swaggerGetAPI, 'api/BackofficeRoleManagement/GetGroupList', {}, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(getRolePermissionGroupListSuccess(response));
        } else {
            yield put(getRolePermissionGroupListFailure(response));
        }
    } catch (error) {
        yield put(getRolePermissionGroupListFailure(error));
    }
}

//Function for Get By ID Role Permission Group API
function* getRolePermissionGroupByIdAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackofficeRoleManagement/GetPermissionGroupDetailById/'+payload.ID, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getRolePermissionGroupByIdSuccess(response));
        } else {
            yield put(getRolePermissionGroupByIdFailure(response));
        }
    } catch (error) {
        yield put(getRolePermissionGroupByIdFailure(error));
    }
}

//Function for Change Status Role Permission Group API
function* changeStatusRolePermissionGroupAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/ChangePermissionGroupStatus', payload, headers);
    const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/UpdateGroup', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(changeStatusRolePermissionGroupSuccess(response));
        } else {
            yield put(changeStatusRolePermissionGroupFailure(response));
        }
    } catch (error) {
        yield put(changeStatusRolePermissionGroupFailure(error));
    }
}

//Function for Get Configuration Role Permission Group API
function* getConfigurationRolePermissionGroupAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackofficeRoleManagement/GetConfigurePermissions', {}, headers);
    
    try {
        if (response.ReturnCode === 0) {
            yield put(getConfigurationRolePermissionGroupSuccess(response));
        } else {
            yield put(getConfigurationRolePermissionGroupFailure(response));
        }
    } catch (error) {
        yield put(getConfigurationRolePermissionGroupFailure(error));
    }
}

//Function for Get Configuration Role Permission Group By ID API
function* getConfigurationRolePermissionGroupByIdAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackofficeRoleManagement/GetConfigurePermissionsByGroupID/'+payload.ID, {}, headers);
    
    try {
        if (response.ReturnCode === 0) {
            yield put(getConfigurationRolePermissionGroupByIdSuccess(response));
        } else {
            yield put(getConfigurationRolePermissionGroupByIdFailure(response));
        }
    } catch (error) {
        yield put(getConfigurationRolePermissionGroupByIdFailure(error));
    }
}

/* Create Sagas method for Add Role Permission Group */
export function* addRolePermissionGroupSagas() {
    yield takeEvery(ADD_ROLE_PERMISSION_GROUP, addRolePermissionGroupAPI);
}

/* Create Sagas method for Edit Role Permission Group */
export function* editRolePermissionGroupSagas() {
    yield takeEvery(EDIT_ROLE_PERMISSION_GROUP, editRolePermissionGroupAPI);
}

/* Create Sagas method for List Role Permission Group */
export function* getRolePermissionGroupListSagas() {
    yield takeEvery(LIST_ROLE_PERMISSION_GROUP, getRolePermissionGroupListAPI);
}

/* Create Sagas method for Get By ID Role Permission Group */
export function* getRolePermissionGroupByIdSagas() {
    yield takeEvery(GET_BY_ID_ROLE_PERMISSION_GROUP, getRolePermissionGroupByIdAPI);
}

/* Create Sagas method for Change Status Role Permission Group */
export function* changeStatusRolePermissionGroupSagas() {
    yield takeEvery(CHANGE_ROLE_PERMISSION_GROUP_STATUS, changeStatusRolePermissionGroupAPI);
}

/* Create Sagas method for Change Status Role Permission Group */
export function* getConfigurationRolePermissionGroupSagas() {
    yield takeEvery(GET_CONFIGURATION_ROLE_PERMISSION_GROUP, getConfigurationRolePermissionGroupAPI);
}

/* Create Sagas method for Change Status Role Permission Group */
export function* getConfigurationRolePermissionGroupByIdSagas() {
    yield takeEvery(GET_CONFIGURATION_ROLE_PERMISSION_GROUP_BY_ID, getConfigurationRolePermissionGroupByIdAPI);
}

export default function* rootSaga() {
    yield all([
        fork(addRolePermissionGroupSagas),
        fork(editRolePermissionGroupSagas),
        fork(getRolePermissionGroupListSagas),
        fork(getRolePermissionGroupByIdSagas),
        fork(changeStatusRolePermissionGroupSagas),
        fork(getConfigurationRolePermissionGroupSagas),
        fork(getConfigurationRolePermissionGroupByIdSagas)
    ]);
}