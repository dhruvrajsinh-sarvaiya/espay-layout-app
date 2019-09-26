import {
    //Activity Log List
    ACTIVITY_LOG_LIST,
    ACTIVITY_LOG_LIST_SUCCESS,
    ACTIVITY_LOG_LIST_FAILURE,

    //Get Module Type
    GET_MODULE_TYPE,
    GET_MODULE_TYPE_SUCCESS,
    GET_MODULE_TYPE_FAILURE,

    // Action Logout
    ACTION_LOGOUT,
    
    // Clear Activity Log
    CLEAR_ACTIVITY_LOG,
} from "../../actions/ActionTypes";
/*
* Initial State
*/
const INITIAL_STATE = {
    //Activity Log List
    loading: false,
    LogHistoryListData: null,

    //Get Module Type
    ModuleTypeData: null,
    isModuleType: false,
}

//Check Action for Activity Log List...
export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE;

        //Handle activity log list method data
        case ACTIVITY_LOG_LIST:
            return Object.assign({}, state, { loading: true })
        //activity log list success data
        case ACTIVITY_LOG_LIST_SUCCESS:
            return Object.assign({}, state, { loading: false, LogHistoryListData: action.payload })
        //activity log list failure data
        case ACTIVITY_LOG_LIST_FAILURE:
            return Object.assign({}, state, { loading: false, error: action.payload })

        //get module type list 
        case GET_MODULE_TYPE:
            return Object.assign({}, state, { isModuleType: true })
        //get module type list success
        case GET_MODULE_TYPE_SUCCESS:
            return Object.assign({}, state, { isModuleType: false, ModuleTypeData: action.payload })
        //get module type list failure
        case GET_MODULE_TYPE_FAILURE:
            return Object.assign({}, state, { isModuleType: false })

        //clear data
        case CLEAR_ACTIVITY_LOG:
            return INITIAL_STATE;

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}