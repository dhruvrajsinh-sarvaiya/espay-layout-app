import {
    //clear data 
    ACTION_LOGOUT,

    //get rule sub module list
    GET_RULE_SUB_MODULE_LIST,
    GET_RULE_SUB_MODULE_LIST_SUCCESS,
    GET_RULE_SUB_MODULE_LIST_FAILURE,

    //clear rule sub module data
    CLEAR_RULE_SUB_MODULE_DATA,

    //get role module
    GET_ROLE_MODULE_LIST,
    GET_ROLE_MODULE_LIST_SUCCESS,
    GET_ROLE_MODULE_LIST_FAILURE,

    //get role module change status
    CHANGE_ROLE_STATUS,
    CHANGE_ROLE_STATUS_SUCCESS,
    CHANGE_ROLE_STATUS_FAILURE,

    //clear role module data
    CLEAR_ROLE_MODULE_DATA,

    //get rule tool list
    GET_RULE_TOOL_LIST,
    GET_RULE_TOOL_LIST_SUCCESS,
    GET_RULE_TOOL_LIST_FAILURE,

    //get rule tool add
    ADD_RULE_TOOL_MODULE_DATA,
    ADD_RULE_TOOL_MODULE_DATA_SUCCESS,
    ADD_RULE_TOOL_MODULE_DATA_FAILURE,

    //get rule tool edit
    EDIT_RULE_TOOL_MODULE_DATA,
    EDIT_RULE_TOOL_MODULE_DATA_SUCCESS,
    EDIT_RULE_TOOL_MODULE_DATA_FAILURE,

    //clear rule tool data
    CLEAR_RULE_TOOL_DATA,

    //user assign role
    USER_ASSIGN_ROLE,
    USER_ASSIGN_ROLE_SUCCESS,
    USER_ASSIGN_ROLE_FAILURE,

    //get all user data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

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

} from "../../actions/ActionTypes";

const INITIAL_STATE = {

    // for rule sub module list
    RuleSubModuleListData: null,
    RuleSubModuleListLoading: false,
    RuleSubModuleListError: false,

    // for update rule sub module status
    UpdatedRuleSubModuleStatus: null,
    UpdatedRuleSubModuleStatusLoading: false,
    UpdatedRuleSubModuleStatusError: false,

    // for role module list
    RoleModuleListData: null,
    RoleModuleListLoading: false,
    RoleModuleListError: false,

    // for role status
    ChangeRoleStatus: null,
    ChangeRoleStatusLoading: false,
    ChangeRoleStatusError: false,

    // for Rule Tool Module List
    RuleToolModuleData: null,
    RuleToolModuleLoading: false,
    RuleToolModuleError: false,

    // for add rule tool module data
    AddRuleToolData: null,
    AddRuleToolLoading: false,
    AddRuleToolError: false,

    // for edit rule tool module data
    EditRuleToolData: null,
    EditRuleToolLoading: false,
    EditRuleToolError: false,

    // for user assign role data
    userAssignRoleData: null,
    userAssignRoleLoading: false,

    //for User list
    userData: null,
    userDataLoading: false,

    //view user by role
    viewUserByRoleData: null,
    viewUserByRoleDataLoading: false,

    //user by detail id
    userDetailByIdData: null,
    userDetailByIdDataLoading: false,

    //remove and assign role data
    removeAndAssignRoleDatas: null,
    removeAndAssignRoleDataLoading: false,
}

export default function UserManagementReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE


        // Handle rule sub module list data
        case GET_RULE_SUB_MODULE_LIST:
            return Object.assign({}, state, {
                RuleSubModuleListData: null,
                RuleSubModuleListLoading: true
            })
        //Set rule sub module list success data
        case GET_RULE_SUB_MODULE_LIST_SUCCESS:
        //Set rule sub module list falure data
        case GET_RULE_SUB_MODULE_LIST_FAILURE:
            return Object.assign({}, state, {
                RuleSubModuleListData: action.data,
                RuleSubModuleListLoading: false,
            })

        //clear rule sub module data
        case CLEAR_RULE_SUB_MODULE_DATA:
            return Object.assign({}, state, {
                UpdatedRuleSubModuleStatus: null,
            })

        // Handle role module list data
        case GET_ROLE_MODULE_LIST:
            return Object.assign({}, state, {
                RoleModuleListData: null,
                RoleModuleListLoading: true
            })
        //Set rule sub module edit failure data
        case GET_ROLE_MODULE_LIST_SUCCESS:
        //Set rule sub module edit failure data
        case GET_ROLE_MODULE_LIST_FAILURE:
            return Object.assign({}, state, {
                RoleModuleListData: action.data,
                RoleModuleListLoading: false,
            })

        // Handle role change status data
        case CHANGE_ROLE_STATUS:
            return Object.assign({}, state, {
                ChangeRoleStatus: null,
                ChangeRoleStatusLoading: true
            })

        //Set role change status success data
        case CHANGE_ROLE_STATUS_SUCCESS:
        //Set role change status failure data
        case CHANGE_ROLE_STATUS_FAILURE:
            return Object.assign({}, state, {
                ChangeRoleStatus: action.data,
                ChangeRoleStatusLoading: false,
            })

        // Handle user assign role data
        case USER_ASSIGN_ROLE:
            return Object.assign({}, state, {
                userAssignRoleData: null,
                userAssignRoleLoading: true
            })
        //Set user assign role success data 
        case USER_ASSIGN_ROLE_SUCCESS:
        //Set user assign role failure data 
        case USER_ASSIGN_ROLE_FAILURE:
            return Object.assign({}, state, {
                userAssignRoleData: action.data,
                userAssignRoleLoading: false,
            })

        // Handle view user by role data
        case VIEW_USER_BY_ROLE:
            return Object.assign({}, state, {
                viewUserByRoleData: null,
                viewUserByRoleDataLoading: true
            })
        //Set view user by role success data 
        case VIEW_USER_BY_ROLE_SUCCESS:
        //Set view user by role failure data 
        case VIEW_USER_BY_ROLE_FAILURE:
            return Object.assign({}, state, {
                viewUserByRoleData: action.data,
                viewUserByRoleDataLoading: false,
            })

        // Handle user by id detail data
        case USER_DETAIL_BY_ID:
            return Object.assign({}, state, {
                userDetailByIdData: null,
                userDetailByIdDataLoading: true
            })

        //Set view user by role success data 
        case USER_DETAIL_BY_ID_SUCCESS:
        //Set view user by role failure data 
        case USER_DETAIL_BY_ID_FAILURE:
            return Object.assign({}, state, {
                userDetailByIdData: action.data,
                userDetailByIdDataLoading: false,
            })

        // Handle user by id detail data
        case REMOVE_AND_ASSIGN_ROLE:
            return Object.assign({}, state, {
                removeAndAssignRoleDatas: null,
                removeAndAssignRoleDataLoading: true
            })
        //Set view user by role success data 
        case REMOVE_AND_ASSIGN_ROLE_SUCCESS:
        //Set view user by role failure data 
        case REMOVE_AND_ASSIGN_ROLE_FAILURE:
            return Object.assign({}, state, {
                removeAndAssignRoleDatas: action.data,
                removeAndAssignRoleDataLoading: false,
            })

        //clear role module data
        case CLEAR_ROLE_MODULE_DATA:
            return Object.assign({}, state, {
                ChangeRoleStatus: null,
                userAssignRoleData: null,
                removeAndAssignRoleDatas: null,
            })

        // Handle rule tool list method data
        case GET_RULE_TOOL_LIST:
            return Object.assign({}, state, {
                RuleToolModuleData: null,
                RuleToolModuleLoading: true
            })
        // Set rule tool list success data
        case GET_RULE_TOOL_LIST_SUCCESS:
        // Set rule tool list failure data
        case GET_RULE_TOOL_LIST_FAILURE:
            return Object.assign({}, state, {
                RuleToolModuleData: action.data,
                RuleToolModuleLoading: false,
            })

        // Handle add rule tool method data
        case ADD_RULE_TOOL_MODULE_DATA:
            return Object.assign({}, state, {
                AddRuleToolData: null,
                AddRuleToolLoading: true
            })
        // Set add rule tool success data
        case ADD_RULE_TOOL_MODULE_DATA_SUCCESS:
        // Set add rule tool list failure data
        case ADD_RULE_TOOL_MODULE_DATA_FAILURE:
            return Object.assign({}, state, {
                AddRuleToolData: action.data,
                AddRuleToolLoading: false,
            })

        // Handle edit rule tool method data
        case EDIT_RULE_TOOL_MODULE_DATA:
            return Object.assign({}, state, {
                EditRuleToolData: null,
                EditRuleToolLoading: true
            })
        // Set edit rule tool success data
        case EDIT_RULE_TOOL_MODULE_DATA_SUCCESS:
        // Set edit rule tool list failure data
        case EDIT_RULE_TOOL_MODULE_DATA_FAILURE:
            return Object.assign({}, state, {
                EditRuleToolData: action.data,
                EditRuleToolLoading: false,
            })

        // Clear Rule Tool Data
        case CLEAR_RULE_TOOL_DATA:
            return Object.assign({}, state, {
                AddRuleToolData: null,
                EditRuleToolData: null,
            })

        // Handle Get userData Data method data
        case GET_USER_DATA:
            return { ...state, userData: null, userDataLoading: true };

        // Handle Set userData Data method data success   
        case GET_USER_DATA_SUCCESS:
        // Handle Get userData Data method data failure
        case GET_USER_DATA_FAILURE:
            return { ...state, userData: action.payload, userDataLoading: false };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}