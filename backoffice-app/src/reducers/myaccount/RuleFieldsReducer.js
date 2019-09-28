//Import action types 
import {
    //Add Rule Field
    ADD_RULE_FIELD,
    ADD_RULE_FIELD_SUCCESS,
    ADD_RULE_FIELD_FAILURE,

    //Edit Rule Field
    EDIT_RULE_FIELD,
    EDIT_RULE_FIELD_SUCCESS,
    EDIT_RULE_FIELD_FAILURE,

    //List Rule Field
    LIST_RULE_FIELD,
    LIST_RULE_FIELD_SUCCESS,
    LIST_RULE_FIELD_FAILURE,

    //clear data
    CLEAR_RULE_FIELD_DATA,
    ACTION_LOGOUT
} from '../../actions/ActionTypes'

/**
 * initial data
 */
const INIT_STATE = {
    //List Rule Field
    ruleFieldListLoading: false,
    ruleFieldListData: null,

    //Add Rule Field
    ruleFieldAddLoading: false,
    ruleFieldAddData: null,

    //edit Rule Field
    ruleFieldUpdateLoading: false,
    ruleFieldUpdateData: null,
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INIT_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INIT_STATE

        //Handle Add Rule Field
        case ADD_RULE_FIELD:
            return Object.assign({}, state, { ruleFieldAddLoading: true })
        //Set Add Rule Field success data
        case ADD_RULE_FIELD_SUCCESS:
            return Object.assign({}, state, { ruleFieldAddLoading: false, ruleFieldAddData: action.payload })
        //Set Add Rule Field failure data
        case ADD_RULE_FIELD_FAILURE:
            return Object.assign({}, state, { ruleFieldAddLoading: false, ruleFieldAddData: action.payload })

        //Handle Edit Rule Field
        case EDIT_RULE_FIELD:
            return Object.assign({}, state, { ruleFieldUpdateLoading: true, })
        //Set Edit Rule Field success data
        case EDIT_RULE_FIELD_SUCCESS:
            return Object.assign({}, state, { ruleFieldUpdateLoading: false, ruleFieldUpdateData: action.payload })
        //Set Edit Rule Field failure data
        case EDIT_RULE_FIELD_FAILURE:
            return Object.assign({}, state, { ruleFieldUpdateLoading: false, ruleFieldUpdateData: action.payload })

        //List Rule Rule Field
        case LIST_RULE_FIELD:
            return Object.assign({}, state, { ruleFieldListLoading: true, ruleFieldListData: null, ruleFieldAddData: null, ruleFieldUpdateData: null, ruleFieldUpdateStatusData: null })
        //Set List Rule Rule Field success data
        case LIST_RULE_FIELD_SUCCESS:
            return Object.assign({}, state, { ruleFieldListLoading: false, ruleFieldListData: action.payload })
        //Set List Rule Rule Field failure data
        case LIST_RULE_FIELD_FAILURE:
            return Object.assign({}, state, { ruleFieldListLoading: false, ruleFieldListData: action.payload })

        //for Clear Refferal
        case CLEAR_RULE_FIELD_DATA:
            return INIT_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
};