/**
 * Create By Sanjay
 * Date : 10/01/2019
 * Reducer for Application Configuration
 */
import {
    ADD_APP_CONFIGURATION,
    ADD_APP_CONFIGURATION_SUCCESS,
    ADD_APP_CONFIGURATION_FAILURE,

    GET_DOMAIN_DATA,
    GET_DOMAIN_DATA_SUCCESS,
    GET_DOMAIN_DATA_FAILURE,

    GET_APPLICATION_LIST,
    GET_APPLICATION_LIST_SUCCESS,
    GET_APPLICATION_LIST_FAILURE,

    GET_APPLICATION_BY_ID,
    GET_APPLICATION_BY_ID_SUCCESS,
    GET_APPLICATION_BY_ID_FAILURE,

    GET_ALL_APPLICATION_DATA,
    GET_ALL_APPLICATION_DATA_SUCCESS,
    GET_ALL_APPLICATION_DATA_FAILURE,

    UPDATE_APP_CONFIGURATION_DATA,
    UPDATE_APP_CONFIGURATION_DATA_SUCCESS,
    UPDATE_APP_CONFIGURATION_DATA_FAILURE
} from "Actions/types";

/** initial data*/
const INIT_STATE = {
    createAppData: {},
    getAppDomain: {},
    getApplicationListData: {},
    ApplicationByID: {},
    getAllApp: {},
    updateAppConfigData: {},
    loading: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case ADD_APP_CONFIGURATION:
            return { ...state, loading: true, createAppData: {} };

        case ADD_APP_CONFIGURATION_SUCCESS:
            return { ...state, loading: false, createAppData: action.payload };

        case ADD_APP_CONFIGURATION_FAILURE:
            return { ...state, loading: false, createAppData: action.payload };

        case GET_DOMAIN_DATA:
            return { ...state, loading: true, getAppDomain: {} };

        case GET_DOMAIN_DATA_SUCCESS:
            return { ...state, loading: false, getAppDomain: action.payload };

        case GET_DOMAIN_DATA_FAILURE:
            return { ...state, loading: false, getAppDomain: action.payload };

        case GET_APPLICATION_LIST:
            return { ...state, loading: true, getApplicationListData: {}, updateAppConfigData: {}, createAppData: {} };

        case GET_APPLICATION_LIST_SUCCESS:
            return { ...state, loading: false, getApplicationListData: action.payload, updateAppConfigData: {}, createAppData: {} };

        case GET_APPLICATION_LIST_FAILURE:
            return { ...state, loading: false, getApplicationListData: action.payload, updateAppConfigData: {}, createAppData: {} };

        case GET_APPLICATION_BY_ID:
            return { ...state, loading: true, ApplicationByID: {} };

        case GET_APPLICATION_BY_ID_SUCCESS:
            return { ...state, loading: false, ApplicationByID: action.payload };

        case GET_APPLICATION_BY_ID_FAILURE:
            return { ...state, loading: false, ApplicationByID: action.payload };

        case GET_ALL_APPLICATION_DATA:
            return { ...state, loading: true, getAllApp: {} };

        case GET_ALL_APPLICATION_DATA_SUCCESS:
            return { ...state, loading: false, getAllApp: action.payload };

        case GET_ALL_APPLICATION_DATA_FAILURE:
            return { ...state, loading: false, getAllApp: action.payload };

        case UPDATE_APP_CONFIGURATION_DATA:
            return { ...state, loading: true, updateAppConfigData: {} };

        case UPDATE_APP_CONFIGURATION_DATA_SUCCESS:
            return { ...state, loading: false, updateAppConfigData: action.payload };

        case UPDATE_APP_CONFIGURATION_DATA_FAILURE:
            return { ...state, loading: false, updateAppConfigData: action.payload };

        default:
            return { ...state };
    };
};