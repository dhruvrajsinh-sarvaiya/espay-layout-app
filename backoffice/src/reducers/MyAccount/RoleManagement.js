/**
 * Auther : Salim Deraiya
 * Created : 22/02/2019
 * Updated By : Bharat Jograna 01/03/2019
 * Role Management Reducer
 */

//Import action types form type.js
import {
    //Add Role Management
    ADD_ROLE_MANAGEMENT,
    ADD_ROLE_MANAGEMENT_SUCCESS,
    ADD_ROLE_MANAGEMENT_FAILURE,

    //Edit Role Management
    EDIT_ROLE_MANAGEMENT,
    EDIT_ROLE_MANAGEMENT_SUCCESS,
    EDIT_ROLE_MANAGEMENT_FAILURE,

    //Change Role Management Status
    CHANGE_ROLE_MANAGEMENT_STATUS,
    CHANGE_ROLE_MANAGEMENT_STATUS_SUCCESS,
    CHANGE_ROLE_MANAGEMENT_STATUS_FAILURE,

    //List Role Management
    LIST_ROLE_MANAGEMENT,
    LIST_ROLE_MANAGEMENT_SUCCESS,
    LIST_ROLE_MANAGEMENT_FAILURE,

    //Get By Id Role Management    
    GET_BY_ID_ROLE_MANAGEMENT,
    GET_BY_ID_ROLE_MANAGEMENT_SUCCESS,
    GET_BY_ID_ROLE_MANAGEMENT_FAILURE,

    //Assign Role Management
    ASSIGN_ROLE_MANAGEMENT,
    ASSIGN_ROLE_MANAGEMENT_SUCCESS,
    ASSIGN_ROLE_MANAGEMENT_FAILURE,

    // Role Assign Hestory (Added By Bharat Jograna)
    USERS_ROLE_ASSIGN_HISTORY,
    USERS_ROLE_ASSIGN_HISTORY_SUCCESS,
    USERS_ROLE_ASSIGN_HISTORY_FAILURE,

    // List User Role Assign (Added By Bharat Jograna)
    LIST_USER_ROLE_ASSIGN_BY_ROLE_ID,
    LIST_USER_ROLE_ASSIGN_BY_ROLE_ID_SUCCESS,
    LIST_USER_ROLE_ASSIGN_BY_ROLE_ID_FAILURE,

    // For User Managemanet Remove And Assign Role (Added By Bharat Jograna)
    REMOVE_AND_ASSIGN_ROLE,
    REMOVE_AND_ASSIGN_ROLE_SUCCESS,
    REMOVE_AND_ASSIGN_ROLE_FAILURE,

    // For List Unassign User Role (Added By Bharat Jograna) 
    LIST_UNASSIGN_USER_ROLE,
    LIST_UNASSIGN_USER_ROLE_SUCCESS,
    LIST_UNASSIGN_USER_ROLE_FAILURE,

} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    data: [],
    list: [],
    getData : [],
    chngStsData : [],
    assignData : [],
    userRoleList : [],
    unassignData: [],
    roleAssignData:[],
    listLoading : false,
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        //Add Role Management
        case ADD_ROLE_MANAGEMENT:
            return { ...state, loading: true, data : '', getData : '', list : '' };

        case ADD_ROLE_MANAGEMENT_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case ADD_ROLE_MANAGEMENT_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Edit Role Management
        case EDIT_ROLE_MANAGEMENT:
            return { ...state, loading: true, data : '', getData : '', list : '' };

        case EDIT_ROLE_MANAGEMENT_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case EDIT_ROLE_MANAGEMENT_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Change Role Management Status
        case CHANGE_ROLE_MANAGEMENT_STATUS:
            return { ...state, listLoading: true, chngStsData : '' };

        case CHANGE_ROLE_MANAGEMENT_STATUS_SUCCESS:
            return { ...state, listLoading: false, chngStsData: action.payload };

        case CHANGE_ROLE_MANAGEMENT_STATUS_FAILURE:
            return { ...state, listLoading: false, chngStsData: action.payload };

        //List Role Management
        case LIST_ROLE_MANAGEMENT:
            return { ...state, listLoading: true, list : '', chngStsData : '' };

        case LIST_ROLE_MANAGEMENT_SUCCESS:
            return { ...state, listLoading: false, list: action.payload };

        case LIST_ROLE_MANAGEMENT_FAILURE:
            return { ...state, listLoading: false, list: action.payload };

        //Get By Id Role Management
        case GET_BY_ID_ROLE_MANAGEMENT:
            return { ...state, loading: true, getData : '', list : '' };

        case GET_BY_ID_ROLE_MANAGEMENT_SUCCESS:
            return { ...state, loading: false, getData: action.payload };

        case GET_BY_ID_ROLE_MANAGEMENT_FAILURE:
            return { ...state, loading: false, getData: action.payload };

        //Assign Role Management
        case ASSIGN_ROLE_MANAGEMENT:
            return { ...state, loading: true, assignData : '' };

        case ASSIGN_ROLE_MANAGEMENT_SUCCESS:
            return { ...state, loading: false, assignData: action.payload };

        case ASSIGN_ROLE_MANAGEMENT_FAILURE:
            return { ...state, loading: false, assignData: action.payload };

        // Added By Bharat Jograna
        //For User Role Assign History
        case USERS_ROLE_ASSIGN_HISTORY:
            return { ...state, loading: true, roleAssignData:'' };

        case USERS_ROLE_ASSIGN_HISTORY_SUCCESS:
            return { ...state, loading: false, roleAssignData: action.payload };

        case USERS_ROLE_ASSIGN_HISTORY_FAILURE:
            return { ...state, loading: false, roleAssignData: action.payload };

        //For List User Role Assign 
        case LIST_USER_ROLE_ASSIGN_BY_ROLE_ID:
            return { ...state, listLoading: true, userRoleList: [], assignData: '' };

        case LIST_USER_ROLE_ASSIGN_BY_ROLE_ID_SUCCESS:
            return { ...state, listLoading: false, userRoleList: action.payload };

        case LIST_USER_ROLE_ASSIGN_BY_ROLE_ID_FAILURE:
            return { ...state, listLoading: false, userRoleList: action.payload };

        //For Remove And Assign Role
        case REMOVE_AND_ASSIGN_ROLE:
            return { ...state, listLoading: true, assignData: '', unassignData: [] };

        case REMOVE_AND_ASSIGN_ROLE_SUCCESS:
            return { ...state, listLoading: false, assignData: action.payload };

        case REMOVE_AND_ASSIGN_ROLE_FAILURE:
            return { ...state, listLoading: false, assignData: action.payload };

        //For Remove And Assign Role
        case LIST_UNASSIGN_USER_ROLE:
            return { ...state, listLoading: true, unassignData: [], assignData: '' };

        case LIST_UNASSIGN_USER_ROLE_SUCCESS:
            return { ...state, listLoading: false, unassignData: action.payload };

        case LIST_UNASSIGN_USER_ROLE_FAILURE:
            return { ...state, listLoading: false, unassignData: action.payload };

        default:
            return { ...state };
    }
};