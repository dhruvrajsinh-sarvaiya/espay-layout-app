/*
    Developer : Bharat Jograna
    Date : 18-02-2019
    update by :
    File Comment : Users and Control Reducer
*/
import {
    USERS_ROLE_ASSIGN_HISTORY,
    USERS_ROLE_ASSIGN_HISTORY_SUCCESS,
    USERS_ROLE_ASSIGN_HISTORY_FAILURE,

    USERS_ADD_ROLE,
    USERS_ADD_ROLE_SUCCESS,
    USERS_ADD_ROLE_FAILURE,

    USERS_LIST_ROLE,
    USERS_LIST_ROLE_SUCCESS,
    USERS_LIST_ROLE_FAILURE,

} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
    loading: false,
    roleAssignData: [],
    addRoleData: [],
    listRoleData: [],
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        //For User Role Assign History
        case USERS_ROLE_ASSIGN_HISTORY:
            return { ...state, loading: true, roleAssignData: [] };

        case USERS_ROLE_ASSIGN_HISTORY_SUCCESS:
            return { ...state, loading: false, roleAssignData: action.payload };

        case USERS_ROLE_ASSIGN_HISTORY_FAILURE:
            return { ...state, loading: false, roleAssignData: action.payload };

        //For User Role Assign History
        case USERS_ADD_ROLE:
            return { ...state, loading: true, addRoleData: [] };

        case USERS_ADD_ROLE_SUCCESS:
            return { ...state, loading: false, addRoleData: action.payload };

        case USERS_ADD_ROLE_FAILURE:
            return { ...state, loading: false, addRoleData: action.payload };

        //For User Role Assign History
        case USERS_LIST_ROLE:
            return { ...state, loading: true, listRoleData: [] };

        case USERS_LIST_ROLE_SUCCESS:
            return { ...state, loading: false, listRoleData: action.payload };

        case USERS_LIST_ROLE_FAILURE:
            return { ...state, loading: false, listRoleData: action.payload };

        default:
            return { ...state };
    }
};
