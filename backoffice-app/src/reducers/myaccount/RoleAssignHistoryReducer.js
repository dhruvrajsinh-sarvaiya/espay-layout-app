import {
    // User Role Assign History
    USERS_ROLE_ASSIGN_HISTORY,
    USERS_ROLE_ASSIGN_HISTORY_SUCCESS,
    USERS_ROLE_ASSIGN_HISTORY_FAILURE,

    // Get User Data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    // Clear data
    ACTION_LOGOUT,
    CLEAR_USERS_ROLE_ASSIGN_HISTORY,
} from "../../actions/ActionTypes";

/**
 * initial data
 */
const INIT_STATE = {
    //role assign list data
    roleAssignData: null,
    roleAssignFetching: false,

    //user data
    userData: null
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
        case CLEAR_USERS_ROLE_ASSIGN_HISTORY:
            return INIT_STATE

        //Handle User Role Assign History method data
        case USERS_ROLE_ASSIGN_HISTORY:
            return Object.assign({}, state, { roleAssignFetching: true, roleAssignData: null })
        //Set User Role Assign History method data success
        case USERS_ROLE_ASSIGN_HISTORY_SUCCESS:
            return Object.assign({}, state, { roleAssignFetching: false, roleAssignData: action.payload })
        //Set User Role Assign History method data failure
        case USERS_ROLE_ASSIGN_HISTORY_FAILURE:
            return Object.assign({}, state, { roleAssignFetching: false, roleAssignData: action.payload })

        //Handle Get user method data
        case GET_USER_DATA:
            return Object.assign({}, state, { userData: null })
        //Set Get user method data success 
        case GET_USER_DATA_SUCCESS:
            return Object.assign({}, state, { userData: action.payload })
        //Set Get user method data failure 
        case GET_USER_DATA_FAILURE:
            return Object.assign({}, state, { userData: action.payload })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
};