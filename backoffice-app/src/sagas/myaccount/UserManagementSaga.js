import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, swaggerPostAPI } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import {
    GET_RULE_MODULE_LIST, UPDATE_RULE_MODULE_STATUS,
    ADD_RULE_MODULE_DATA, EDIT_RULE_MODULE_DATA, GET_RULE_SUB_MODULE_LIST,
    ADD_RULE_SUB_MODULE_DATA, EDIT_RULE_SUB_MODULE_DATA, GET_ROLE_MODULE_LIST,
    CHANGE_ROLE_STATUS, ADD_ROLE_MODULE_DATA, EDIT_ROLE_MODULE_DATA, GET_RULE_TOOL_LIST,
    ADD_RULE_TOOL_MODULE_DATA, EDIT_RULE_TOOL_MODULE_DATA, GET_USERS_LIST, CHANGE_USER_STATUS,
    GET_GROUP_LIST, EDIT_USER_DATA, ADD_USER_DATA, USER_ASSIGN_ROLE,
    VIEW_USER_BY_ROLE, USER_DETAIL_BY_ID, REMOVE_AND_ASSIGN_ROLE
} from '../../actions/ActionTypes';
import {
    getRuleModuleListSuccess, getRuleModuleListFailure,
    updateRuleModuleStatusSuccess, updateRuleModuleStatusFailure,
    addRuleModuleDataSuccess, addRuleModuleDataFailure,
    editRuleModuleDataSuccess, editRuleModuleDataFailure,
    getRuleSubModuleListSuccess, getRuleSubModuleListFailure,
    addRuleSubModuleDataSuccess, addRuleSubModuleDataFailure,
    editRuleSubModuleDataSuccess, editRuleSubModuleDataFailure,
    getRoleModuleListSuccess, getRoleModuleListFailure,
    changeRoleStatusSuccess, changeRoleStatusFailure,
    addRoleModuleDataSuccess, addRoleModuleDataFailure,
    editRoleModuleDataSuccess, editRoleModuleDataFailure,
    getRuleToolListSuccess, getRuleToolListFailure, addRuleToolDataSuccess,
    addRuleToolDataFailure, editRuleToolDataSuccess, editRuleToolDataFailure,
    getUsersListSuccess, getUsersListFailure, changeUserStatusSuccess,
    changeUserStatusFailure, getGroupListSuccess, getGroupListFailure,
    addUserDataSuccess, editUserDataSuccess, editUserDataFailure,
    userRoleAssignDataSuccess, userRoleAssignDataFailure,
    viewUSerByRoleDataSuccess, viewUSerByRoleDataFailure,
    getUserDetailByIdDataSuccess, getUserDetailByIdDataFailure,
    removeAndAssignRoleDataSuccess, removeAndAssignRoleDataFailure
} from '../../actions/account/UserManagementActions';

export default function* UserManagementSaga() {
    // Get Rule Module List
    yield takeEvery(GET_RULE_MODULE_LIST, getRuleModuleList);
    // Update Rule Module Status
    yield takeEvery(UPDATE_RULE_MODULE_STATUS, updateRuleModuleStatus);
    // Add Rule Module Data
    yield takeEvery(ADD_RULE_MODULE_DATA, addRuleModuleData);
    // Edit Rule Module Data
    yield takeEvery(EDIT_RULE_MODULE_DATA, editRuleModuleData);
    // Get Rule Sub Module List
    yield takeEvery(GET_RULE_SUB_MODULE_LIST, getRuleSubModuleList);
    // Add Rule Sub Module Data
    yield takeEvery(ADD_RULE_SUB_MODULE_DATA, addRuleSubModuleData);
    // Edit Rule Sub Module Data
    yield takeEvery(EDIT_RULE_SUB_MODULE_DATA, editRuleSubModuleData);
    // Get Role Module Data
    yield takeEvery(GET_ROLE_MODULE_LIST, getRoleModuleList);
    // Change Role Module Status Data
    yield takeEvery(CHANGE_ROLE_STATUS, changeRoleStatus);
    // Add Role Module Data
    yield takeEvery(ADD_ROLE_MODULE_DATA, addRoleModuleData);
    // Edit Role Module Data
    yield takeEvery(EDIT_ROLE_MODULE_DATA, editRoleModuleData);
    // Edit Role Module Data
    yield takeEvery(USER_ASSIGN_ROLE, userRoleAssignData);
    // Get Rule Tool Module List
    yield takeEvery(GET_RULE_TOOL_LIST, getRuleToolModuleList);
    // Add Rule Tool Module Data
    yield takeEvery(ADD_RULE_TOOL_MODULE_DATA, addRuleToolModuleData);
    // Edit Rule Tool Module Data
    yield takeEvery(EDIT_RULE_TOOL_MODULE_DATA, editRuleToolModuleData);
    // User Lists Data
    yield takeEvery(GET_USERS_LIST, getUsersList);
    // Change User Status
    yield takeEvery(CHANGE_USER_STATUS, changeUserStatus);
    // Get Group List
    yield takeEvery(GET_GROUP_LIST, getGroupList);
    // Add User Data
    yield takeEvery(ADD_USER_DATA, addUserData);
    // Edit User Data
    yield takeEvery(EDIT_USER_DATA, editUserData);
    // view user by role
    yield takeEvery(VIEW_USER_BY_ROLE, viewUserByRole);
    // view user detail by id
    yield takeEvery(USER_DETAIL_BY_ID, userDetailByIdData);
    // view remove and assign role data
    yield takeEvery(REMOVE_AND_ASSIGN_ROLE, removeAndAssignRoleData);
}

// Generator for Edit User Module
function* editUserData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Edit User Module Data Api
        const data = yield call(swaggerPostAPI, Method.EditUser, payload, headers);

        // To set Edit User Module success response to reducer
        yield put(editUserDataSuccess(data));
    } catch (error) {
        // To set Edit User Module failure response to reducer
        yield put(editUserDataFailure());
    }
}

// Generator for Add User Module
function* addUserData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Add User Module Data Api
        const data = yield call(swaggerPostAPI, Method.CreateUser, payload, headers);

        // To set Add User Module success response to reducer
        yield put(addUserDataSuccess(data));
    } catch (error) {
        // To set Add User Module failure response to reducer
        yield put(addUserDataFailure());
    }
}

// Generator for Group List Module
function* getGroupList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get Group List Module Data Api
        const data = yield call(swaggerGetAPI, Method.GetGroupList, payload, headers);

        // To set Get Group List Module success response to reducer
        yield put(getGroupListSuccess(data));
    } catch (error) {
        // To set Get Group List Module failure response to reducer
        yield put(getGroupListFailure());
    }
}

// Generator for Change User Status Module
function* changeUserStatus({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Change User Status Module Data Api
        const data = yield call(swaggerPostAPI, Method.ChangeUserStatus + '/' + payload.UserId + '/' + payload.Status, payload, headers);

        // To set Change User Status Module success response to reducer
        yield put(changeUserStatusSuccess(data));
    } catch (error) {
        // To set Change User Status Module failure response to reducer
        yield put(changeUserStatusFailure());
    }
}

// Generator for User List
function* getUsersList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // create requestUrl
        let url = Method.ListUserDetail + '/' + payload.PageNo + '?PageSize=' + payload.PageSize

        // To call Users List Api
        const data = yield call(swaggerGetAPI, url, {}, headers);

        // To set User List success response to reducer
        yield put(getUsersListSuccess(data));
    } catch (error) {
        // To set User List failure response to reducer
        yield put(getUsersListFailure());
    }
}

// Generator for Edit Rule Tool Module
function* editRuleToolModuleData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Edit Rule Tool Module Data Api
        const data = yield call(swaggerPostAPI, Method.UpdateToolData, payload, headers);

        // To set Edit Rule Tool Module success response to reducer
        yield put(editRuleToolDataSuccess(data));
    } catch (error) {
        // To set Edit Rule Tool Module failure response to reducer
        yield put(editRuleToolDataFailure());
    }
}

// Generator for Add Rule Tool Module
function* addRuleToolModuleData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Add Rule Tool Module Data Api
        const data = yield call(swaggerPostAPI, Method.AddToolData, payload, headers);

        // To set Add Rule Tool Module success response to reducer
        yield put(addRuleToolDataSuccess(data));
    } catch (error) {
        // To set Add Rule Tool Module failure response to reducer
        yield put(addRuleToolDataFailure());
    }
}

// Generator for Rule Tool Module
function* getRuleToolModuleList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // create requestUrl
        let url = Method.GetAllToolData + '/' + payload.PageNo + '?PageSize=' + payload.PageSize

        if (payload.AllRecords !== undefined && payload.AllRecords > 0) {
            url += '&AllRecords=' + payload.AllRecords;
        }

        // To call Rule Tool List Api
        const data = yield call(swaggerGetAPI, url, {}, headers);

        // To set Rule Tool List success response to reducer
        yield put(getRuleToolListSuccess(data));

    } catch (error) {
        // To set Rule Tool List failure response to reducer
        yield put(getRuleToolListFailure());
    }
}


// Generator for Edit Role Module
function* editRoleModuleData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call update user role Api
        const data = yield call(swaggerPostAPI, Method.UpdateUserRole, payload, headers);

        // To set update user role success response to reducer
        yield put(editRoleModuleDataSuccess(data));

    } catch (error) {

        // To set update user role success response to reducer
        yield put(editRoleModuleDataFailure());
    }
}

// Generator for user assign role
function* userRoleAssignData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call user assign role Api
        const data = yield call(swaggerPostAPI, Method.AssignRole + payload.RoleId + '/' + payload.UserId, payload, headers);

        // To set user assign role success response to reducer
        yield put(userRoleAssignDataSuccess(data));

    } catch (error) {

        // To set user assign role success response to reducer
        yield put(userRoleAssignDataFailure());
    }
}

// Generator for remove and assgin role data
function* removeAndAssignRoleData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call remove and assgin role data Api
        const data = yield call(swaggerPostAPI, Method.RemoveAndAssignRole + payload.RoleId + '/' + payload.UserId, payload, headers);

        // To set remove and assgin role data success response to reducer
        yield put(removeAndAssignRoleDataSuccess(data));

    } catch (error) {

        // To set remove and assgin role data success response to reducer
        yield put(removeAndAssignRoleDataFailure());
    }
}

// Generator for user assign role
function* viewUserByRole({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call view user by role Api
        const data = yield call(swaggerGetAPI, Method.ViewUsersByRole + payload.RoleID, {}, headers);

        // To set view user by role success response to reducer
        yield put(viewUSerByRoleDataSuccess(data));

    } catch (error) {

        // To set view user by role success response to reducer
        yield put(viewUSerByRoleDataFailure());
    }
}

// Generator for user assign role
function* userDetailByIdData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call user detail by id Api
        const data = yield call(swaggerGetAPI, Method.GetUserDetailById + '?UserId=' + payload.UserId, {}, headers);

        // To set user detail by id success response to reducer
        yield put(getUserDetailByIdDataSuccess(data));

    } catch (error) {


        // To set user detail by id success response to reducer
        yield put(getUserDetailByIdDataFailure());
    }
}

// Generator for Add Role Module
function* addRoleModuleData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call add user role Api
        const data = yield call(swaggerPostAPI, Method.CreateUserRole, payload, headers);

        // To set add user role success response to reducer
        yield put(addRoleModuleDataSuccess(data));

    } catch (error) {

        // To set add user role success response to reducer
        yield put(addRoleModuleDataFailure());
    }
}

// Generator for Update Rule Sub Status
function* changeRoleStatus({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call change role status Api
        const data = yield call(swaggerPostAPI, Method.ChangeRoleStatus, payload, headers);

        // To set change role status success response to reducer
        yield put(changeRoleStatusSuccess(data));
    } catch (error) {

        // To set change role status success response to reducer
        yield put(changeRoleStatusFailure());
    }
}

// Generator for Rule Module List
function* getRoleModuleList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let Request = Method.ListRoleDetails + '/' + payload.PageNo;
        let obj = { PageSize: payload.PageSize }

        if (payload.Status !== undefined && payload.Status !== '') {
            obj = {
                ...obj,
                Status: payload.Status
            }
        }
        if (payload.AllRecords !== undefined && payload.AllRecords !== '') {
            obj = {
                ...obj,
                AllRecords: payload.AllRecords
            }
        }

        let newRequest = Request + queryBuilder(obj)

        // To call role details list Api
        const data = yield call(swaggerGetAPI, newRequest, {}, headers);
        //data={"Result":[{"ModuleID":25,"ModuleName":"Rule","Status":1},{"ModuleID":24,"ModuleName":"hello","Status":0},{"ModuleID":23,"ModuleName":"Help Desk123","Status":0},{"ModuleID":22,"ModuleName":"Project2","Status":1},{"ModuleID":21,"ModuleName":"Help Desk6","Status":1},{"ModuleID":20,"ModuleName":"Help Desk5","Status":0},{"ModuleID":19,"ModuleName":"Help Desk4","Status":0},{"ModuleID":18,"ModuleName":"Help Desk3","Status":1},{"ModuleID":17,"ModuleName":"Help Desk2","Status":1},{"ModuleID":16,"ModuleName":"Help Desk1","Status":1}],"TotalCount":23,"PageNo":0,"PageSize":10,"ReturnCode":0,"ReturnMsg":"Record Found Successfully!","ErrorCode":14003,"statusCode":200}

        // To set role details list success response to reducer
        yield put(getRoleModuleListSuccess(data));
    } catch (error) {

        // To set role details list success response to reducer
        yield put(getRoleModuleListFailure());
    }
}

// Generator for Edit Rule Sub Module
function* editRuleSubModuleData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call update sub module Api
        const data = yield call(swaggerPostAPI, Method.UpdateSubModuleData, payload, headers);

        // To set update sub module success response to reducer
        yield put(editRuleSubModuleDataSuccess(data));
    } catch (error) {

        // To set update sub module success response to reducer
        yield put(editRuleSubModuleDataFailure());
    }
}

// Generator for Add Rule Sub Module
function* addRuleSubModuleData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call add sub module Api
        const data = yield call(swaggerPostAPI, Method.AddSubModuleData, payload, headers);

        // To set add sub module success response to reducer
        yield put(addRuleSubModuleDataSuccess(data));
    } catch (error) {

        // To set add sub module success response to reducer
        yield put(addRuleSubModuleDataFailure());
    }
}

// Generator for Rule Sub Module List
function* getRuleSubModuleList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let Request = Method.GetAllSubModuleData + '/' + payload.PageNo;
        let obj = { PageSize: payload.PageSize }

        if (payload.AllRecords !== undefined && payload.AllRecords !== '') {
            obj = {
                ...obj,
                AllRecords: payload.AllRecords
            }
        }

        let newRequest = Request + queryBuilder(obj)

        // To call all sub module list Api
        const data = yield call(swaggerGetAPI, newRequest, {}, headers);
        //data={"Result":[{"ModuleID":25,"ModuleName":"Rule","Status":1},{"ModuleID":24,"ModuleName":"hello","Status":0},{"ModuleID":23,"ModuleName":"Help Desk123","Status":0},{"ModuleID":22,"ModuleName":"Project2","Status":1},{"ModuleID":21,"ModuleName":"Help Desk6","Status":1},{"ModuleID":20,"ModuleName":"Help Desk5","Status":0},{"ModuleID":19,"ModuleName":"Help Desk4","Status":0},{"ModuleID":18,"ModuleName":"Help Desk3","Status":1},{"ModuleID":17,"ModuleName":"Help Desk2","Status":1},{"ModuleID":16,"ModuleName":"Help Desk1","Status":1}],"TotalCount":23,"PageNo":0,"PageSize":10,"ReturnCode":0,"ReturnMsg":"Record Found Successfully!","ErrorCode":14003,"statusCode":200}

        // To set all sub module list success response to reducer
        yield put(getRuleSubModuleListSuccess(data));
    } catch (error) {

        // To set all sub module list success response to reducer
        yield put(getRuleSubModuleListFailure());
    }
}

// Generator for Edit Rule Module
function* editRuleModuleData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call update mdoule Api
        const data = yield call(swaggerPostAPI, Method.UpdateModuleData, payload, headers);

        // To set update mdoule success response to reducer
        yield put(editRuleModuleDataSuccess(data));

    } catch (error) {

        // To set update mdoule success response to reducer
        yield put(editRuleModuleDataFailure());
    }
}

// Generator for Add Rule Module
function* addRuleModuleData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call add module Api
        const data = yield call(swaggerPostAPI, Method.AddModuleData, payload, headers);

        // To set add module success response to reducer
        yield put(addRuleModuleDataSuccess(data));

    } catch (error) {

        // To set add module success response to reducer
        yield put(addRuleModuleDataFailure());
    }
}

// Generator for Rule Module Status
function* updateRuleModuleStatus({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call update status module Api
        const data = yield call(swaggerPostAPI, Method.ChangeStatusModuleData + queryBuilder(payload), {}, headers);

        // To set update status module success response to reducer
        yield put(updateRuleModuleStatusSuccess(data));

    } catch (error) {

        // To set update status module success response to reducer
        yield put(updateRuleModuleStatusFailure());
    }
}

// Generator for Rule Module List
function* getRuleModuleList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let Request = Method.GetAllModuleData1 + '/' + payload.PageNo;
        let obj = { PageSize: payload.PageSize }

        if (payload.AllRecords !== undefined && payload.AllRecords !== '') {
            obj = {
                ...obj,
                AllRecords: payload.AllRecords
            }
        }
        if (payload.IsParentList !== undefined && payload.IsParentList !== '') {
            obj = {
                ...obj,
                IsParentList: payload.IsParentList
            }
        }

        let newRequest = Request + queryBuilder(obj)

        // To call all module data1 Api
        const data = yield call(swaggerGetAPI, newRequest, {}, headers);
        //data={"Result":[{"ModuleID":25,"ModuleName":"Rule","Status":1},{"ModuleID":24,"ModuleName":"hello","Status":0},{"ModuleID":23,"ModuleName":"Help Desk123","Status":0},{"ModuleID":22,"ModuleName":"Project2","Status":1},{"ModuleID":21,"ModuleName":"Help Desk6","Status":1},{"ModuleID":20,"ModuleName":"Help Desk5","Status":0},{"ModuleID":19,"ModuleName":"Help Desk4","Status":0},{"ModuleID":18,"ModuleName":"Help Desk3","Status":1},{"ModuleID":17,"ModuleName":"Help Desk2","Status":1},{"ModuleID":16,"ModuleName":"Help Desk1","Status":1}],"TotalCount":23,"PageNo":0,"PageSize":10,"ReturnCode":0,"ReturnMsg":"Record Found Successfully!","ErrorCode":14003,"statusCode":200}

        // To set all module data1 success response to reducer
        yield put(getRuleModuleListSuccess(data));

    } catch (error) {

        // To set all module data1 success response to reducer
        yield put(getRuleModuleListFailure());
    }
}