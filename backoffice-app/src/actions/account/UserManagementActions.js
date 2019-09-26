import { action } from "../GlobalActions";
import {
    //get rule module
    GET_RULE_MODULE_LIST,
    GET_RULE_MODULE_LIST_SUCCESS,
    GET_RULE_MODULE_LIST_FAILURE,

    //update rule module status
    UPDATE_RULE_MODULE_STATUS,
    UPDATE_RULE_MODULE_STATUS_SUCCESS,
    UPDATE_RULE_MODULE_STATUS_FAILURE,

    //clear rule module
    CLEAR_RULE_MODULE_DATA,

    //add rule module
    ADD_RULE_MODULE_DATA,
    ADD_RULE_MODULE_DATA_SUCCESS,
    ADD_RULE_MODULE_DATA_FAILURE,

    //edit rule module
    EDIT_RULE_MODULE_DATA,
    EDIT_RULE_MODULE_DATA_SUCCESS,
    EDIT_RULE_MODULE_DATA_FAILURE,

    //get rule sub module
    GET_RULE_SUB_MODULE_LIST,
    GET_RULE_SUB_MODULE_LIST_SUCCESS,
    GET_RULE_SUB_MODULE_LIST_FAILURE,

    //clear rule sub module
    CLEAR_RULE_SUB_MODULE_DATA,

    //add rule sub module
    ADD_RULE_SUB_MODULE_DATA_SUCCESS,
    ADD_RULE_SUB_MODULE_DATA_FAILURE,
    ADD_RULE_SUB_MODULE_DATA,

    //edit rule sub module
    EDIT_RULE_SUB_MODULE_DATA,
    EDIT_RULE_SUB_MODULE_DATA_SUCCESS,
    EDIT_RULE_SUB_MODULE_DATA_FAILURE,

    //get role module
    GET_ROLE_MODULE_LIST,
    GET_ROLE_MODULE_LIST_SUCCESS,
    GET_ROLE_MODULE_LIST_FAILURE,

    //get role module status
    CHANGE_ROLE_STATUS,
    CHANGE_ROLE_STATUS_SUCCESS,
    CHANGE_ROLE_STATUS_FAILURE,

    //clear role module 
    CLEAR_ROLE_MODULE_DATA,

    //get role module add
    ADD_ROLE_MODULE_DATA,
    ADD_ROLE_MODULE_DATA_FAILURE,
    ADD_ROLE_MODULE_DATA_SUCCESS,

    //get role module edit
    EDIT_ROLE_MODULE_DATA,
    EDIT_ROLE_MODULE_DATA_SUCCESS,
    EDIT_ROLE_MODULE_DATA_FAILURE,

    //get rule tool
    GET_RULE_TOOL_LIST,
    GET_RULE_TOOL_LIST_SUCCESS,
    GET_RULE_TOOL_LIST_FAILURE,

    //add rule tool
    ADD_RULE_TOOL_MODULE_DATA,
    ADD_RULE_TOOL_MODULE_DATA_SUCCESS,
    ADD_RULE_TOOL_MODULE_DATA_FAILURE,

    //edit rule tool
    EDIT_RULE_TOOL_MODULE_DATA,
    EDIT_RULE_TOOL_MODULE_DATA_SUCCESS,
    EDIT_RULE_TOOL_MODULE_DATA_FAILURE,

    //cleat rule tool
    CLEAR_RULE_TOOL_DATA,

    //get user list
    GET_USERS_LIST,
    GET_USERS_LIST_SUCCESS,
    GET_USERS_LIST_FAILURE,

    //get change user status
    CHANGE_USER_STATUS,
    CHANGE_USER_STATUS_SUCCESS,
    CHANGE_USER_STATUS_FAILURE,

    //get group list
    GET_GROUP_LIST,
    GET_GROUP_LIST_SUCCESS,
    GET_GROUP_LIST_FAILURE,

    //add user data
    ADD_USER_DATA,
    ADD_USER_DATA_SUCCESS,
    ADD_USER_DATA_FAILURE,

    //edit user data
    EDIT_USER_DATA,
    EDIT_USER_DATA_SUCCESS,
    EDIT_USER_DATA_FAILURE,

    //clear user data
    CLEAR_USER_DATA,

    //user assign role
    USER_ASSIGN_ROLE,
    USER_ASSIGN_ROLE_SUCCESS,
    USER_ASSIGN_ROLE_FAILURE,

    //view user role
    VIEW_USER_BY_ROLE,
    VIEW_USER_BY_ROLE_SUCCESS,
    VIEW_USER_BY_ROLE_FAILURE,

    //user detail by id
    USER_DETAIL_BY_ID,
    USER_DETAIL_BY_ID_SUCCESS,
    USER_DETAIL_BY_ID_FAILURE,

    //Remove and assign role
    REMOVE_AND_ASSIGN_ROLE,
    REMOVE_AND_ASSIGN_ROLE_SUCCESS,
    REMOVE_AND_ASSIGN_ROLE_FAILURE,
} from "../ActionTypes";

// Action for Edit Role module
export function editRoleModuleData(payload) {
    // for loading
    return action(EDIT_ROLE_MODULE_DATA, { payload })
}
export function editRoleModuleDataSuccess(data) {
    // for success call
    return action(EDIT_ROLE_MODULE_DATA_SUCCESS, { data })
}
export function editRoleModuleDataFailure() {
    // for failure call
    return action(EDIT_ROLE_MODULE_DATA_FAILURE)
}

// Action for Add Role module
export function addRoleModuleData(payload) {
    // for loading
    return action(ADD_ROLE_MODULE_DATA, { payload })
}
export function addRoleModuleDataSuccess(data) {
    // for success call
    return action(ADD_ROLE_MODULE_DATA_SUCCESS, { data })
}
export function addRoleModuleDataFailure() {
    // for failure call
    return action(ADD_ROLE_MODULE_DATA_FAILURE)
}

// Action for Change Role Status
export function changeRoleStatus(payload) {
    // for loading
    return action(CHANGE_ROLE_STATUS, { payload })
}
export function changeRoleStatusSuccess(data) {
    // for success call
    return action(CHANGE_ROLE_STATUS_SUCCESS, { data })
}
export function changeRoleStatusFailure() {
    // for failure call
    return action(CHANGE_ROLE_STATUS_FAILURE)
}

// Action for Role module list
export function getRoleModuleList(payload) {
    // for loading
    return action(GET_ROLE_MODULE_LIST, { payload })
}
export function getRoleModuleListSuccess(data) {
    // for success call
    return action(GET_ROLE_MODULE_LIST_SUCCESS, { data })
}
export function getRoleModuleListFailure() {
    // for failure call
    return action(GET_ROLE_MODULE_LIST_FAILURE)
}

// Clear Role Module Data
export function clearRoleModuleData() {
    return action(CLEAR_ROLE_MODULE_DATA)
}

// Action for Rule module list
export function getRuleModuleList(payload) {
    // for loading
    return action(GET_RULE_MODULE_LIST, { payload })
}
export function getRuleModuleListSuccess(data) {
    // for success call
    return action(GET_RULE_MODULE_LIST_SUCCESS, { data })
}
export function getRuleModuleListFailure() {
    // for failure call
    return action(GET_RULE_MODULE_LIST_FAILURE)
}

// Action for Update Rule module status
export function updateRuleModuleStatus(payload) {
    // for loading
    return action(UPDATE_RULE_MODULE_STATUS, { payload })
}
export function updateRuleModuleStatusSuccess(data) {
    // for success call
    return action(UPDATE_RULE_MODULE_STATUS_SUCCESS, { data })
}
export function updateRuleModuleStatusFailure() {
    // for failure call
    return action(UPDATE_RULE_MODULE_STATUS_FAILURE)
}

// Action for Add Rule module
export function addRuleModuleData(payload) {
    // for loading
    return action(ADD_RULE_MODULE_DATA, { payload })
}
export function addRuleModuleDataSuccess(data) {
    // for success call
    return action(ADD_RULE_MODULE_DATA_SUCCESS, { data })
}
export function addRuleModuleDataFailure() {
    // for failure call
    return action(ADD_RULE_MODULE_DATA_FAILURE)
}

// Action for Edit Rule module
export function editRuleModuleData(payload) {
    // for loading
    return action(EDIT_RULE_MODULE_DATA, { payload })
}
export function editRuleModuleDataSuccess(data) {
    // for success call
    return action(EDIT_RULE_MODULE_DATA_SUCCESS, { data })
}
export function editRuleModuleDataFailure() {
    // for failure call
    return action(EDIT_RULE_MODULE_DATA_FAILURE)
}

// Action for Rule Sub module list
export function getRuleSubModuleList(payload) {
    // for loading
    return action(GET_RULE_SUB_MODULE_LIST, { payload })
}
export function getRuleSubModuleListSuccess(data) {
    // for success call
    return action(GET_RULE_SUB_MODULE_LIST_SUCCESS, { data })
}
export function getRuleSubModuleListFailure() {
    // for failure call
    return action(GET_RULE_SUB_MODULE_LIST_FAILURE)
}

// Action for Add Rule Sub module
export function addRuleSubModuleData(payload) {
    // for loading
    return action(ADD_RULE_SUB_MODULE_DATA, { payload })
}
export function addRuleSubModuleDataSuccess(data) {
    // for success call
    return action(ADD_RULE_SUB_MODULE_DATA_SUCCESS, { data })
}
export function addRuleSubModuleDataFailure() {
    // for failure call
    return action(ADD_RULE_SUB_MODULE_DATA_FAILURE)
}

// Action for Edit Rule Sub module
export function editRuleSubModuleData(payload) {
    // for loading
    return action(EDIT_RULE_SUB_MODULE_DATA, { payload })
}
export function editRuleSubModuleDataSuccess(data) {
    // for success call
    return action(EDIT_RULE_SUB_MODULE_DATA_SUCCESS, { data })
}
export function editRuleSubModuleDataFailure() {
    // for failure call
    return action(EDIT_RULE_SUB_MODULE_DATA_FAILURE)
}

// Clear Rule Module Data
export function clearRuleModuleData() {
    return action(CLEAR_RULE_MODULE_DATA)
}

// Clear Rule Sub Module Data
export function clearRuleSubModuleData() {
    return action(CLEAR_RULE_SUB_MODULE_DATA)
}

// Redux action for Get Rule Tool List
export function getRuleToolList(payload) {
    return action(GET_RULE_TOOL_LIST, { payload })
}

// Redux action for Get Rule Tool List Success
export function getRuleToolListSuccess(data) {
    return action(GET_RULE_TOOL_LIST_SUCCESS, { data })
}

// Redux action for Get Rule Tool List Success
export function getRuleToolListFailure() {
    return action(GET_RULE_TOOL_LIST_FAILURE)
}

// Redux action for Add Rule Tool Data
export function addRuleToolData(payload) {
    return action(ADD_RULE_TOOL_MODULE_DATA, { payload })
}

// Redux action for Add Rule Tool List Success
export function addRuleToolDataSuccess(data) {
    return action(ADD_RULE_TOOL_MODULE_DATA_SUCCESS, { data })
}

// Redux action for Add Rule Tool List Success
export function addRuleToolDataFailure() {
    return action(ADD_RULE_TOOL_MODULE_DATA_FAILURE)
}

// Redux action for Edit Rule Tool Data
export function editRuleToolData(payload) {
    return action(EDIT_RULE_TOOL_MODULE_DATA, { payload })
}

// Redux action for Edit Rule Tool List Success
export function editRuleToolDataSuccess(data) {
    return action(EDIT_RULE_TOOL_MODULE_DATA_SUCCESS, { data })
}

// Redux action for Edit Rule Tool List Success
export function editRuleToolDataFailure() {
    return action(EDIT_RULE_TOOL_MODULE_DATA_FAILURE)
}

// Clear Rule Tool Module Data
export function clearRuleToolModuleData() {
    return action(CLEAR_RULE_TOOL_DATA)
}

// Redux action for Get Rule Tool List
export function getUsersList(payload) {
    return action(GET_USERS_LIST, { payload })
}

// Redux action for Get Rule Tool List Success
export function getUsersListSuccess(data) {
    return action(GET_USERS_LIST_SUCCESS, { data })
}

// Redux action for Get Rule Tool List Failure
export function getUsersListFailure() {
    return action(GET_USERS_LIST_FAILURE)
}

// Redux action for Change User Status
export function changeUserStatus(payload) {
    return action(CHANGE_USER_STATUS, { payload })
}

// Redux action for Change User Status Success
export function changeUserStatusSuccess(data) {
    return action(CHANGE_USER_STATUS_SUCCESS, { data })
}

// Redux action for Change User Status Failure
export function changeUserStatusFailure() {
    return action(CHANGE_USER_STATUS_FAILURE)
}

// Redux action for Get Group List
export function getGroupList(payload) {
    return action(GET_GROUP_LIST, { payload })
}

// Redux action for Get Group List Success
export function getGroupListSuccess(data) {
    return action(GET_GROUP_LIST_SUCCESS, { data })
}

// Redux action for Get Group List Failure
export function getGroupListFailure() {
    return action(GET_GROUP_LIST_FAILURE)
}

// Redux action for Add User Data
export function addUserData(payload) {
    return action(ADD_USER_DATA, { payload })
}

// Redux action for Add User Data Success
export function addUserDataSuccess(data) {
    return action(ADD_USER_DATA_SUCCESS, { data })
}

// Redux action for Add User Data Failure
export function addUserDataFailure() {
    return action(ADD_USER_DATA_FAILURE)
}

// Redux action for Edit User Data
export function editUserData(payload) {
    return action(EDIT_USER_DATA, { payload })
}

// Redux action for Edit User Data Success
export function editUserDataSuccess(data) {
    return action(EDIT_USER_DATA_SUCCESS, { data })
}

// Redux action for Edit User Data Failure
export function editUserDataFailure() {
    return action(EDIT_USER_DATA_FAILURE)
}

// Action for user RoleAssign
export function userRoleAssignData(payload) {
    // for loading
    return action(USER_ASSIGN_ROLE, { payload })
}
export function userRoleAssignDataSuccess(data) {
    // for success call
    return action(USER_ASSIGN_ROLE_SUCCESS, { data })
}
export function userRoleAssignDataFailure() {
    // for failure call
    return action(USER_ASSIGN_ROLE_FAILURE)
}

// Action for view user role by id
export function viewUSerByRoleData(payload) {
    // for loading
    return action(VIEW_USER_BY_ROLE, { payload })
}
export function viewUSerByRoleDataSuccess(data) {
    // for success call
    return action(VIEW_USER_BY_ROLE_SUCCESS, { data })
}
export function viewUSerByRoleDataFailure() {
    // for failure call
    return action(VIEW_USER_BY_ROLE_FAILURE)
}

// Action for user detail by id
export function getUserDetailByIdData(payload) {
    // for loading
    return action(USER_DETAIL_BY_ID, { payload })
}
export function getUserDetailByIdDataSuccess(data) {
    // for success call
    return action(USER_DETAIL_BY_ID_SUCCESS, { data })
}
export function getUserDetailByIdDataFailure() {
    // for failure call
    return action(USER_DETAIL_BY_ID_FAILURE)
}

// Action for remove and assign role
export function removeAndAssignRoleData(payload) {
    // for loading
    return action(REMOVE_AND_ASSIGN_ROLE, { payload })
}
export function removeAndAssignRoleDataSuccess(data) {
    // for success call
    return action(REMOVE_AND_ASSIGN_ROLE_SUCCESS, { data })
}
export function removeAndAssignRoleDataFailure() {
    // for failure call
    return action(REMOVE_AND_ASSIGN_ROLE_FAILURE)
}


// Redux action for Clear User Data
export function clearUserData() {
    return action(CLEAR_USER_DATA)
}