/**
 * Create By Sanjay 
 * Created Date 25/03/2019
 * Reducer For Service Provider CRUD Operation 
 */

import {

    LIST_SERVICE_PROVIDER,
    LIST_SERVICE_PROVIDER_SUCCESS,
    LIST_SERVICE_PROVIDER_FAILURE,

    ADD_SERVICE_PROVIDER,
    ADD_SERVICE_PROVIDER_SUCCESS,
    ADD_SERVICE_PROVIDER_FAILURE,

    UPDATE_SERVICE_PROVIDER,
    UPDATE_SERVICE_PROVIDER_SUCCESS,
    UPDATE_SERVICE_PROVIDER_FAILURE

} from "Actions/types";

const INIT_STATE = {
    loading: false,
    loading_add: false,
    listServiceProviderData: {},
    addServiceProviderData: {},
    updateServiceProviderData: {}
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        case LIST_SERVICE_PROVIDER:
            return {
                ...state,
                loading: true,
                listServiceProviderData: {},
                addServiceProviderData: {},
                updateServiceProviderData: {}
            };

        case LIST_SERVICE_PROVIDER_SUCCESS:
        case LIST_SERVICE_PROVIDER_FAILURE:
            return { ...state, loading: false, listServiceProviderData: action.payload };

        case ADD_SERVICE_PROVIDER:
            return { ...state, loading_add: true, addServiceProviderData: {} };

        case ADD_SERVICE_PROVIDER_SUCCESS:
        case ADD_SERVICE_PROVIDER_FAILURE:
            return { ...state, loading_add: false, addServiceProviderData: action.payload };

        case UPDATE_SERVICE_PROVIDER:
            return { ...state, loading: true, updateServiceProviderData: {} };

        case UPDATE_SERVICE_PROVIDER_SUCCESS:
        case UPDATE_SERVICE_PROVIDER_FAILURE:
            return { ...state, loading: false, updateServiceProviderData: action.payload };        

        default:
            return { ...state };
    }
};