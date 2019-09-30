import {


    //clear data
    ACTION_LOGOUT,
    CLEAR_ROLE_MODULE_DATA,

    //add role module data
    ADD_ROLE_MODULE_DATA,
    ADD_ROLE_MODULE_DATA_SUCCESS,
    ADD_ROLE_MODULE_DATA_FAILURE,

    //edit role module data
    EDIT_ROLE_MODULE_DATA,
    EDIT_ROLE_MODULE_DATA_SUCCESS,
    EDIT_ROLE_MODULE_DATA_FAILURE,
} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {

    // for add role data
    AddRoleModuleData: null,
    AddRoleModuleLoading: false,
    AddRoleModuleError: false,

    // for Edit Rule Module list
    EditRoleModuleData: null,
    EditRoleModuleLoading: false,
    EditRoleModuleError: false,
}

export default function RoleModuleReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle add role module data
        case ADD_ROLE_MODULE_DATA:
            return Object.assign({}, state, {
                AddRoleModuleData: null,
                AddRoleModuleLoading: true
            })
        //Set add role module success data 
        case ADD_ROLE_MODULE_DATA_SUCCESS:
        //Set add role module failure data 
        case ADD_ROLE_MODULE_DATA_FAILURE:
            return Object.assign({}, state, {
                AddRoleModuleData: action.data,
                AddRoleModuleLoading: false,
            })

        // Handle edit role module data
        case EDIT_ROLE_MODULE_DATA:
            return Object.assign({}, state, {
                EditRoleModuleData: null,
                EditRoleModuleLoading: true
            })
        //Set edit role module success data 
        case EDIT_ROLE_MODULE_DATA_SUCCESS:
        //Set edit role module failure data 
        case EDIT_ROLE_MODULE_DATA_FAILURE:
            return Object.assign({}, state, {
                EditRoleModuleData: action.data,
                EditRoleModuleLoading: false,
            })

        //clear role module data
        case CLEAR_ROLE_MODULE_DATA:
            return Object.assign({}, state, {
                AddRoleModuleData: null,
                EditRoleModuleData: null,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}