/**
 * Auther : Salim Deraiya
 * Created : 22/02/2019
 * Updated By : Bharat Jograna 01/03/2019
 * Role Management Sagas
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { 
    ADD_ROLE_MANAGEMENT,
    EDIT_ROLE_MANAGEMENT,
    CHANGE_ROLE_MANAGEMENT_STATUS,
    LIST_ROLE_MANAGEMENT,
    GET_BY_ID_ROLE_MANAGEMENT,
    ASSIGN_ROLE_MANAGEMENT,
    // Added By Bharat Jograna
    USERS_ROLE_ASSIGN_HISTORY,
    LIST_USER_ROLE_ASSIGN_BY_ROLE_ID,
    REMOVE_AND_ASSIGN_ROLE,
    LIST_UNASSIGN_USER_ROLE,
} from "Actions/types";

import { 
    addRoleManagementSuccess,
    addRoleManagementFailure,
    editRoleManagementSuccess,
    editRoleManagementFailure,
    changeStatusRoleManagementSuccess,
    changeStatusRoleManagementFailure,
    getRoleManagementListSuccess,
    getRoleManagementListFailure,
    getRoleManagementByIdSuccess,
    getRoleManagementByIdFailure,
    assignRoleManagementSuccess,
    assignRoleManagementFailure,
    // Added By Bharat Jograna
    roleAssignHistorySuccess,
    roleAssignHistoryFailure,
    listUserRoleAssignByRoleIdSuccess,
    listUserRoleAssignByRoleIdFailure,
    removeAndAssignRoleSuccess,
    removeAndAssignRoleFailure,
    listUnassignUserRoleSuccess,
    listUnassignUserRoleFailure,
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Function for Add Role Management API
function* addRoleManagementAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/CreateUserRole', payload, headers);
    
    try {
        if (response.ReturnCode === 0) {
            yield put(addRoleManagementSuccess(response));
        } else {
            yield put(addRoleManagementFailure(response));
        }
    } catch (error) {
        yield put(addRoleManagementFailure(error));
    }
}

//Function for Edit Role Management API
function* editRoleManagementAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/UpdateUserRole', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(editRoleManagementSuccess(response));
        } else {
            yield put(editRoleManagementFailure(response));
        }
    } catch (error) {
        yield put(editRoleManagementFailure(error));
    }
}

//Function for List Role Management API
function* listRoleManagementAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var sUrl = 'api/BackofficeRoleManagement/ListRoleDetails/'+payload.PageNo+'?PageSize='+payload.PageSize;
    if(payload.hasOwnProperty('Status') && payload.Status >= 0) {
        sUrl += '&Status='+payload.Status;
    }
    
    if(payload.hasOwnProperty('AllRecords') && payload.AllRecords > 0) {
        sUrl += '&AllRecords='+payload.AllRecords;
    }

    const response = yield call(swaggerGetAPI, sUrl, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getRoleManagementListSuccess(response));
        } else {
            yield put(getRoleManagementListFailure(response));
        }
    } catch (error) {
        yield put(getRoleManagementListFailure(error));
    }
}

//Function for Get By ID Role Management API
function* getByIdRoleManagementAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackofficeRoleManagement/GetRoleByID/'+payload.ID, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getRoleManagementByIdSuccess(response));
        } else {
            yield put(getRoleManagementByIdFailure(response));
        }
    } catch (error) {
        yield put(getRoleManagementByIdFailure(error));
    }
}

//Function for Change Status Role Management API
function* changeStatusRoleManagementAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/ChangeRoleStatus', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(changeStatusRoleManagementSuccess(response));
        } else {
            yield put(changeStatusRoleManagementFailure(response));
        }
    } catch (error) {
        yield put(changeStatusRoleManagementFailure(error));
    }
}

//Function for Assign Role Management API
function* assignRoleManagementAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/AssignRole/'+payload.RoleId+'/'+payload.UserId, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(assignRoleManagementSuccess(response));
        } else {
            yield put(assignRoleManagementFailure(response));
        }
    } catch (error) {
        yield put(assignRoleManagementFailure(error));
    }
}

// Added By Bharat Jograna
//Function for Buy Trade Report Configuration API
function* roleAssignHistoryAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var sUrl = 'api/BackofficeRoleManagement/GetRoleHistory/' + payload.PageNo + '?PageSize=' + payload.PageSize + '&FromDate=' + payload.FromDate + '&ToDate=' + payload.ToDate;

    if (payload.hasOwnProperty('UserId') && payload.UserId !== "") {
        sUrl += '&UserId=' + payload.UserId;
    }

    if (payload.hasOwnProperty('ModuleId') && payload.ModuleId !== "") {
        sUrl += '&ModuleId=' + payload.ModuleId;
    }

    if (payload.hasOwnProperty('Status') && payload.Status !== "") {
        sUrl += '&Status=' + payload.Status;
    }

    const response = yield call(swaggerGetAPI, sUrl, {}, headers);
    try {
        if (response.statusCode === 200) {
            yield put(roleAssignHistorySuccess(response));
        } else {
            yield put(roleAssignHistoryFailure(response));
        }
    } catch (error) {
        yield put(roleAssignHistoryFailure(error));
    }
}

//Function for Buy Trade Report Configuration API
function* listUserRoleAssignAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var sUrl = 'api/BackofficeRoleManagement/ViewUsersByRole/' + payload.ID;

    const response = yield call(swaggerGetAPI, sUrl, {}, headers);
    try {
        if (response.statusCode === 200) {
            yield put(listUserRoleAssignByRoleIdSuccess(response));
        } else {
            yield put(listUserRoleAssignByRoleIdFailure(response));
        }
    } catch (error) {
        yield put(listUserRoleAssignByRoleIdFailure(error));
    }
}

//Function for Remove And Assign Role API
function* removeAndAssignRoleSagaAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/RemoveAndAssignRole/' + payload.RoleId + '/' + payload.UserId, {}, headers);
    try {
        if (response.statusCode === 200) {
            yield put(removeAndAssignRoleSuccess(response));
        } else {
            yield put(removeAndAssignRoleFailure(response));
        }
    } catch (error) {
        yield put(removeAndAssignRoleFailure(error));
    }
}

//Function for List Unassign User Role API
function* listUnassignUserRoleAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }

    var sUrl = 'api/BackofficeRoleManagement/ViewUnassignedUsers/' + payload.PageNo + '?PageSize=' + payload.PageSize + '&FromDate=' + payload.FromDate + '&ToDate=' + payload.ToDate;

    if (payload.hasOwnProperty('UserName') && payload.UserName !== "") {
        sUrl += '&UserName=' + payload.UserName;
    }

    if (payload.hasOwnProperty('Status') && payload.Status !== "") {
        sUrl += '&Status=' + payload.Status;
    }

    const response = yield call(swaggerGetAPI, sUrl, {}, headers);
    try {
        if (response.statusCode === 200) {
            yield put(listUnassignUserRoleSuccess(response));
        } else {
            yield put(listUnassignUserRoleFailure(response));
        }
    } catch (error) {
        yield put(listUnassignUserRoleFailure(error));
    }
}

/* Create Sagas method for Add Role Management */
export function* addRoleManagementSagas() {
    yield takeEvery(ADD_ROLE_MANAGEMENT, addRoleManagementAPI);
}

/* Create Sagas method for Edit Role Management */
export function* editRoleManagementSagas() {
    yield takeEvery(EDIT_ROLE_MANAGEMENT, editRoleManagementAPI);
}

/* Create Sagas method for List Role Management */
export function* listRoleManagementSagas() {
    yield takeEvery(LIST_ROLE_MANAGEMENT, listRoleManagementAPI);
}

/* Create Sagas method for Get By ID Role Management */
export function* getByIdRoleManagementSagas() {
    yield takeEvery(GET_BY_ID_ROLE_MANAGEMENT, getByIdRoleManagementAPI);
}

/* Create Sagas method for Change Status Role Management */
export function* changeStatusRoleManagementSagas() {
    yield takeEvery(CHANGE_ROLE_MANAGEMENT_STATUS, changeStatusRoleManagementAPI);
}

/* Create Sagas method for Assign Role Management */
export function* assignRoleManagementSagas() {
    yield takeEvery(ASSIGN_ROLE_MANAGEMENT, assignRoleManagementAPI);
}

// Added By Bharat Jograna
/* Create Sagas method for Buy Trade Report Configuration */
export function* userRoleAssignHistory() {
    yield takeEvery(USERS_ROLE_ASSIGN_HISTORY, roleAssignHistoryAPI);
}

/* Create Sagas method for Buy Trade Report Configuration */
export function* listUserRoleAssign() {
    yield takeEvery(LIST_USER_ROLE_ASSIGN_BY_ROLE_ID, listUserRoleAssignAPI);
}

/* Create Sagas method for Remove And Assign Role */
export function* removeAndAssignRoleSaga() {
    yield takeEvery(REMOVE_AND_ASSIGN_ROLE, removeAndAssignRoleSagaAPI);
}

/* Create Sagas method for List Unassign User Role */
export function* listUnassignUserRoleSaga() {
    yield takeEvery(LIST_UNASSIGN_USER_ROLE, listUnassignUserRoleAPI);
}

export default function* rootSaga() {
    yield all([
        fork(addRoleManagementSagas),
        fork(editRoleManagementSagas),
        fork(listRoleManagementSagas),
        fork(getByIdRoleManagementSagas),
        fork(changeStatusRoleManagementSagas),
        fork(assignRoleManagementSagas),
        // Added By Bharat Jograna
        fork(userRoleAssignHistory),
        fork(listUserRoleAssign),
        fork(removeAndAssignRoleSaga),
        fork(listUnassignUserRoleSaga),
    ]);
}