/**
 * Auther : Salim Deraiya
 * Created : 22/02/2019
 * Role Permission Group Reducer
 */

//Import action types form type.js
import {
    //Add Role Permission Group
    ADD_ROLE_PERMISSION_GROUP,
    ADD_ROLE_PERMISSION_GROUP_SUCCESS,
    ADD_ROLE_PERMISSION_GROUP_FAILURE,

    //Edit Role Permission Group
    EDIT_ROLE_PERMISSION_GROUP,
    EDIT_ROLE_PERMISSION_GROUP_SUCCESS,
    EDIT_ROLE_PERMISSION_GROUP_FAILURE,

    //Change Role Permission Group Status
    CHANGE_ROLE_PERMISSION_GROUP_STATUS,
    CHANGE_ROLE_PERMISSION_GROUP_STATUS_SUCCESS,
    CHANGE_ROLE_PERMISSION_GROUP_STATUS_FAILURE,

    //List Role Permission Group
    LIST_ROLE_PERMISSION_GROUP,
    LIST_ROLE_PERMISSION_GROUP_SUCCESS,
    LIST_ROLE_PERMISSION_GROUP_FAILURE,

    //Get By Id Role Permission Group    
    GET_BY_ID_ROLE_PERMISSION_GROUP,
    GET_BY_ID_ROLE_PERMISSION_GROUP_SUCCESS,
    GET_BY_ID_ROLE_PERMISSION_GROUP_FAILURE,

    //Get Configuration Role Permission Group
    GET_CONFIGURATION_ROLE_PERMISSION_GROUP,
    GET_CONFIGURATION_ROLE_PERMISSION_GROUP_SUCCESS,
    GET_CONFIGURATION_ROLE_PERMISSION_GROUP_FAILURE,

    //Get Configuration Role Permission Group By Id
    GET_CONFIGURATION_ROLE_PERMISSION_GROUP_BY_ID,
    GET_CONFIGURATION_ROLE_PERMISSION_GROUP_BY_ID_SUCCESS,
    GET_CONFIGURATION_ROLE_PERMISSION_GROUP_BY_ID_FAILURE,

} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    data: [],
    list: [],
    getData : [],
    chngStsData: [],
    assignData : [],
    configData : [],
    listLoading : false,
    loading: false
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        //Add Role Permission Group
        case ADD_ROLE_PERMISSION_GROUP:
        case EDIT_ROLE_PERMISSION_GROUP:
            return { ...state, loading: true, data : '', getData : '', list : '' };

        case ADD_ROLE_PERMISSION_GROUP_SUCCESS:
        case ADD_ROLE_PERMISSION_GROUP_FAILURE:
        case EDIT_ROLE_PERMISSION_GROUP_SUCCESS:
        case EDIT_ROLE_PERMISSION_GROUP_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Change Role Permission Group Status
        case CHANGE_ROLE_PERMISSION_GROUP_STATUS:
            return { ...state, listLoading: true, chngStsData : '', list : '' };

        case CHANGE_ROLE_PERMISSION_GROUP_STATUS_SUCCESS:
        case CHANGE_ROLE_PERMISSION_GROUP_STATUS_FAILURE:
            return { ...state, listLoading: false, chngStsData: action.payload };

        //List Role Permission Group
        case LIST_ROLE_PERMISSION_GROUP:
            return { ...state, listLoading: true, data : '', chngStsData : '', list : '' };

        case LIST_ROLE_PERMISSION_GROUP_SUCCESS:
        case LIST_ROLE_PERMISSION_GROUP_FAILURE:
            return { ...state, listLoading: false, list: action.payload };

        //Get By Id Role Permission Group
        case GET_BY_ID_ROLE_PERMISSION_GROUP:
            return { ...state, loading: true, data : '', getData : '', chngStsData : '', list : '' };

        case GET_BY_ID_ROLE_PERMISSION_GROUP_SUCCESS:
        case GET_BY_ID_ROLE_PERMISSION_GROUP_FAILURE:
            return { ...state, loading: false, getData: action.payload };

        //Get Configuration Role Permission Group
        case GET_CONFIGURATION_ROLE_PERMISSION_GROUP:
        case GET_CONFIGURATION_ROLE_PERMISSION_GROUP_BY_ID:
            return { ...state, loading: true, configData : '', chngStsData : '', getData : '', list : '' };

        case GET_CONFIGURATION_ROLE_PERMISSION_GROUP_SUCCESS:
        case GET_CONFIGURATION_ROLE_PERMISSION_GROUP_FAILURE:
        case GET_CONFIGURATION_ROLE_PERMISSION_GROUP_BY_ID_SUCCESS:
        case GET_CONFIGURATION_ROLE_PERMISSION_GROUP_BY_ID_FAILURE:
            return { ...state, loading: false, configData: action.payload };

        default:
            return { ...state };
    }
};