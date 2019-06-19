/* 
    Developer : Kevin Ladani
    Date : 16-01-2019
    File Comment : MyAccount Password Policy Dashboard
*/
import {
    LIST_PASSWORD_POLICY_DASHBOARD,
    LIST_PASSWORD_POLICY_DASHBOARD_SUCCESS,
    LIST_PASSWORD_POLICY_DASHBOARD_FAILURE,

    ADD_PASSWORD_POLICY_DASHBOARD,
    ADD_PASSWORD_POLICY_DASHBOARD_SUCCESS,
    ADD_PASSWORD_POLICY_DASHBOARD_FAILURE,

    DELETE_PASSWORD_POLICY_DASHBOARD,
    DELETE_PASSWORD_POLICY_DASHBOARD_SUCCESS,
    DELETE_PASSWORD_POLICY_DASHBOARD_FAILURE,

    UPDATE_PASSWORD_POLICY_DASHBOARD,
    UPDATE_PASSWORD_POLICY_DASHBOARD_SUCCESS,
    UPDATE_PASSWORD_POLICY_DASHBOARD_FAILURE,
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    passwordList: [],
    conversion: [],
    data: [],
    loading: false,
    ext_flag: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        //List IP Range Configuration..
        case LIST_PASSWORD_POLICY_DASHBOARD:
            return { ...state, loading: true, ext_flag: false, data: '', conversion: '' };

        case LIST_PASSWORD_POLICY_DASHBOARD_SUCCESS:
            return { ...state, loading: false, passwordList: action.payload };

        case LIST_PASSWORD_POLICY_DASHBOARD_FAILURE:
            return { ...state, loading: false, passwordList: action.payload };

        //Add Password Policy Configuration..
        case ADD_PASSWORD_POLICY_DASHBOARD:
            return { ...state, loading: true };

        case ADD_PASSWORD_POLICY_DASHBOARD_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case ADD_PASSWORD_POLICY_DASHBOARD_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Delete Password Policy Configuration..
        case DELETE_PASSWORD_POLICY_DASHBOARD:
            return { ...state, loading: true };

        case DELETE_PASSWORD_POLICY_DASHBOARD_SUCCESS:
            return { ...state, loading: false, conversion: action.payload, ext_flag: true };

        case DELETE_PASSWORD_POLICY_DASHBOARD_FAILURE:
            return { ...state, loading: false, conversion: action.payload, ext_flag: true };

        //Update Password Policy Configuration..
        case UPDATE_PASSWORD_POLICY_DASHBOARD:
            return { ...state, loading: true };

        case UPDATE_PASSWORD_POLICY_DASHBOARD_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case UPDATE_PASSWORD_POLICY_DASHBOARD_FAILURE:
            return { ...state, loading: false, data: action.payload };

        default:
            return { ...state };
    }
};