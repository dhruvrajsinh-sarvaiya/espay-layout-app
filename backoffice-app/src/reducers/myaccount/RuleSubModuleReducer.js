import {
    //clear data
    ACTION_LOGOUT,

    //get rule sub module add
    ADD_RULE_SUB_MODULE_DATA,
    ADD_RULE_SUB_MODULE_DATA_SUCCESS,
    ADD_RULE_SUB_MODULE_DATA_FAILURE,

    //get rule sub module edit
    EDIT_RULE_SUB_MODULE_DATA,
    EDIT_RULE_SUB_MODULE_DATA_SUCCESS,
    EDIT_RULE_SUB_MODULE_DATA_FAILURE,

    //clear rule sub module data
    CLEAR_RULE_SUB_MODULE_DATA,

} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {

    // for add sub module
    AddRuleSubModuleData: null,
    AddRuleSubModuleLoading: false,
    AddRuleSubModuleError: false,

    // for edit rule sub module
    EditRuleSubModuleData: null,
    EditRuleSubModuleLoading: false,
    EditRuleSubModuleError: false,
}

export default function RuleSubModuleReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        //clear rule sub module data
        case CLEAR_RULE_SUB_MODULE_DATA:
            return Object.assign({}, state, {
                AddRuleSubModuleData: null,
                EditRuleSubModuleData: null,
            })

        // Handle rule sub module add data
        case ADD_RULE_SUB_MODULE_DATA:
            return Object.assign({}, state, {
                AddRuleSubModuleData: null,
                AddRuleSubModuleLoading: true
            })
        //Set rule sub module add success data
        case ADD_RULE_SUB_MODULE_DATA_SUCCESS:
        //Set rule sub module add failure data
        case ADD_RULE_SUB_MODULE_DATA_FAILURE:
            return Object.assign({}, state, {
                AddRuleSubModuleData: action.data,
                AddRuleSubModuleLoading: false,
            })

        // Handle rule sub module edit data
        case EDIT_RULE_SUB_MODULE_DATA:
            return Object.assign({}, state, {
                EditRuleSubModuleData: null,
                EditRuleSubModuleLoading: true
            })
        //Set rule sub module edit success data
        case EDIT_RULE_SUB_MODULE_DATA_SUCCESS:
        //Set rule sub module edit failure data
        case EDIT_RULE_SUB_MODULE_DATA_FAILURE:
            return Object.assign({}, state, {
                EditRuleSubModuleData: action.data,
                EditRuleSubModuleLoading: false,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}