//Import action types 
import {
    // Clear data
    ACTION_LOGOUT,
    CLEAR_LIST_UNASSIGN_USER_ROLE,

    // List Unassign User Role
    LIST_UNASSIGN_USER_ROLE,
    LIST_UNASSIGN_USER_ROLE_SUCCESS,
    LIST_UNASSIGN_USER_ROLE_FAILURE
} from "../../actions/ActionTypes";

/**
 * initial data
 */
const INIT_STATE = {
    //unassign user role list
    unassignData: null,
    listLoading: false,
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INIT_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INIT_STATE

        //for clear data
        case CLEAR_LIST_UNASSIGN_USER_ROLE:
            return INIT_STATE;

        //Handle unassign user role method data
        case LIST_UNASSIGN_USER_ROLE:
            return Object.assign({}, state, { listLoading: true, unassignData: null })
        //Set unassign user role method success data
        case LIST_UNASSIGN_USER_ROLE_SUCCESS:
            return Object.assign({}, state, { listLoading: false, unassignData: action.payload })
        //Set unassign user role method failure data
        case LIST_UNASSIGN_USER_ROLE_FAILURE:
            return Object.assign({}, state, { listLoading: false, unassignData: action.payload })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
};