/* 
    Developer : Kevin Ladani
    Date : 23-01-2019
    File Comment : MyAccount Profile Config Dashboard
*/
import {
    LIST_PROFILE_CONFIG_DASHBOARD,
    LIST_PROFILE_CONFIG_DASHBOARD_SUCCESS,
    LIST_PROFILE_CONFIG_DASHBOARD_FAILURE,

    ADD_PROFILE_CONFIG_DASHBOARD,
    ADD_PROFILE_CONFIG_DASHBOARD_SUCCESS,
    ADD_PROFILE_CONFIG_DASHBOARD_FAILURE,

    DELETE_PROFILE_CONFIG_DASHBOARD,
    DELETE_PROFILE_CONFIG_DASHBOARD_SUCCESS,
    DELETE_PROFILE_CONFIG_DASHBOARD_FAILURE,

    UPDATE_PROFILE_CONFIG_DASHBOARD,
    UPDATE_PROFILE_CONFIG_DASHBOARD_SUCCESS,
    UPDATE_PROFILE_CONFIG_DASHBOARD_FAILURE,

    GET_PROFILE_TYPE,
    GET_PROFILE_TYPE_SUCCESS,
    GET_PROFILE_TYPE_FAILURE,

    GET_KYCLEVEL_LIST,
    GET_KYCLEVEL_LIST_SUCCESS,
    GET_KYCLEVEL_LIST_FAILURE,

    GET_PROFILELEVEL_LIST,
    GET_PROFILELEVEL_LIST_SUCCESS,
    GET_PROFILELEVEL_LIST_FAILURE,

    GET_PROFILEBY_ID,
    GET_PROFILEBY_ID_SUCCESS,
    GET_PROFILEBY_ID_FAILURE,

    GET_LIST_CURRENCY,
    GET_LIST_CURRENCY_SUCCESS,
    GET_LIST_CURRENCY_FAILURE,
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    profileList: [],
    conversion: [],
    data: [],
    profileType: [],
    kycLevelList: [],
    profileLevelList: [],
    profileByID: [],
    currencyList: [],
    loading: false,
    ext_flag: false,
};

export default (state, action) => {
    if (typeof state === 'undefined') {
      return INIT_STATE
    }
    switch (action.type) {
        //List Profile Configuration..
        case LIST_PROFILE_CONFIG_DASHBOARD:
            return { ...state, loading: true, ext_flag: false };

        case LIST_PROFILE_CONFIG_DASHBOARD_SUCCESS:
        case LIST_PROFILE_CONFIG_DASHBOARD_FAILURE:
            return { ...state, loading: false, profileList: action.payload };

        //Add Profile Configuration..
        case ADD_PROFILE_CONFIG_DASHBOARD:
            return { ...state, loading: true };

        case ADD_PROFILE_CONFIG_DASHBOARD_SUCCESS:
        case ADD_PROFILE_CONFIG_DASHBOARD_FAILURE:
            return { ...state, loading: false, data: action.payload, ext_flag: true };

        //Delete Profile Configuration..
        case DELETE_PROFILE_CONFIG_DASHBOARD:
            return { ...state, loading: true };

        case DELETE_PROFILE_CONFIG_DASHBOARD_SUCCESS:
        case DELETE_PROFILE_CONFIG_DASHBOARD_FAILURE:
            return { ...state, loading: false, conversion: action.payload, ext_flag: true };

        //Update Profile Configuration..
        case UPDATE_PROFILE_CONFIG_DASHBOARD:
            return { ...state, loading: true };

        case UPDATE_PROFILE_CONFIG_DASHBOARD_SUCCESS:
        case UPDATE_PROFILE_CONFIG_DASHBOARD_FAILURE:
            return { ...state, loading: false, data: action.payload, ext_flag: true };

        case GET_PROFILE_TYPE:
            return { ...state, loading: true, profileType: '' };

        case GET_PROFILE_TYPE_SUCCESS:
            return { ...state, loading: false, profileType: action.payload };

        case GET_PROFILE_TYPE_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case GET_KYCLEVEL_LIST:
            return { ...state, loading: true, kycLevelList: '' };

        case GET_KYCLEVEL_LIST_SUCCESS:
            return { ...state, loading: false, kycLevelList: action.payload };

        case GET_KYCLEVEL_LIST_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case GET_PROFILELEVEL_LIST:
            return { ...state, loading: true, profileLevelList: '' };

        case GET_PROFILELEVEL_LIST_SUCCESS:
            return { ...state, loading: false, profileLevelList: action.payload };

        case GET_PROFILELEVEL_LIST_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case GET_PROFILEBY_ID:
            return { ...state, loading: true, ext_flag: false };

        case GET_PROFILEBY_ID_SUCCESS:
            return { ...state, loading: false, profileByID: action.payload };

        case GET_PROFILEBY_ID_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case GET_LIST_CURRENCY:
            return { ...state, loading: true, currencyList: '' };

        case GET_LIST_CURRENCY_SUCCESS:
            return { ...state, loading: false, currencyList: action.payload };

        case GET_LIST_CURRENCY_FAILURE:
            return { ...state, loading: false, error: action.payload };


        default:
            return { ...state };
    }
};