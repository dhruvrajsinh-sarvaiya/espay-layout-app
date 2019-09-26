import {
    //clear data
    ACTION_LOGOUT,

    //get rule module list
    GET_RULE_MODULE_LIST,
    GET_RULE_MODULE_LIST_SUCCESS,
    GET_RULE_MODULE_LIST_FAILURE,

    //get rule module change status 
    UPDATE_RULE_MODULE_STATUS,
    UPDATE_RULE_MODULE_STATUS_SUCCESS,
    UPDATE_RULE_MODULE_STATUS_FAILURE,

    //claear rule module data
    CLEAR_RULE_MODULE_DATA,

    //get add rule module data
    ADD_RULE_MODULE_DATA,
    ADD_RULE_MODULE_DATA_SUCCESS,
    ADD_RULE_MODULE_DATA_FAILURE,

    //get edit rule module data
    EDIT_RULE_MODULE_DATA,
    EDIT_RULE_MODULE_DATA_SUCCESS,
    EDIT_RULE_MODULE_DATA_FAILURE,

} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {
    // for rule module list
    RuleModuleListData: null,
    RuleModuleListLoading: false,
    RuleModuleListError: false,

    // for update rule module status
    UpdatedRuleModuleStatus: null,
    UpdatedRuleModuleStatusLoading: false,
    UpdatedRuleModuleStatusError: false,

    // for Add Rule Module list
    AddRuleModuleData: null,
    AddRuleModuleLoading: false,
    AddRuleModuleError: false,

    // for Edit Rule Module list
    EditRuleModuleData: null,
    EditRuleModuleLoading: false,
    EditRuleModuleError: false,

}

export default function RuleModuleReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle rule module list data
        case GET_RULE_MODULE_LIST:
            return Object.assign({}, state, {
                RuleModuleListData: null,
                RuleModuleListLoading: true
            })
        //Set rule module list data success
        case GET_RULE_MODULE_LIST_SUCCESS:
        //Set rule module list data failure
        case GET_RULE_MODULE_LIST_FAILURE:
            return Object.assign({}, state, {
                RuleModuleListData: action.data,
                RuleModuleListLoading: false,
            })

        // Handle rule module upadate status data
        case UPDATE_RULE_MODULE_STATUS:
            return Object.assign({}, state, {
                UpdatedRuleModuleStatus: null,
                UpdatedRuleModuleStatusLoading: true
            })
        //set rule module upadate status success data 
        case UPDATE_RULE_MODULE_STATUS_SUCCESS:
        //set rule module upadate status failure data 
        case UPDATE_RULE_MODULE_STATUS_FAILURE:
            return Object.assign({}, state, {
                UpdatedRuleModuleStatus: action.data,
                UpdatedRuleModuleStatusLoading: false,
            })

        // Handle add rule module data
        case ADD_RULE_MODULE_DATA:
            return Object.assign({}, state, {
                AddRuleModuleData: null,
                AddRuleModuleLoading: true
            })
        //Set add rule module success data
        case ADD_RULE_MODULE_DATA_SUCCESS:
        //Set add rule module failure data
        case ADD_RULE_MODULE_DATA_FAILURE:
            return Object.assign({}, state, {
                AddRuleModuleData: action.data,
                AddRuleModuleLoading: false,
            })

        // Handle edit rule module data
        case EDIT_RULE_MODULE_DATA:
            return Object.assign({}, state, {
                EditRuleModuleData: null,
                EditRuleModuleLoading: true
            })
        //Set edit rule module success data
        case EDIT_RULE_MODULE_DATA_SUCCESS:
        //Set edit rule module success data
        case EDIT_RULE_MODULE_DATA_FAILURE:
            return Object.assign({}, state, {
                EditRuleModuleData: action.data,
                EditRuleModuleLoading: false,
            })

        // clear rule module data
        case CLEAR_RULE_MODULE_DATA:
            return Object.assign({}, state, {
                UpdatedRuleModuleStatus: null,
                AddRuleModuleData: null,
                EditRuleModuleData: null,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}