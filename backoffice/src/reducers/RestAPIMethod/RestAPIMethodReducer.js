/**
 * Create By Sanjay 
 * Created Date 19/03/2019
 * Reducer For Rest API Method 
 */

import {

    LIST_API_METHOD,
    LIST_API_METHOD_SUCCESS,
    LIST_API_METHOD_FAILURE,

    ADD_API_METHOD,
    ADD_API_METHOD_SUCCESS,
    ADD_API_METHOD_FAILURE,

    UPDATE_API_METHOD,
    UPDATE_API_METHOD_SUCCESS,
    UPDATE_API_METHOD_FAILURE,

    LIST_SYSTEM_RESET_METHOD,
    LIST_SYSTEM_RESET_METHOD_SUCCESS,
    LIST_SYSTEM_RESET_METHOD_FAILURE,

    LIST_SOCKET_METHOD,
    LIST_SOCKET_METHOD_SUCCESS,
    LIST_SOCKET_METHOD_FAILURE

} from "Actions/types";

const INIT_STATE = {
    loading: false,
    loading_methods: false,
    apiMethodListData: {},
    addApiMethodData: {},
    updateApiMethodData: {},
    resetMethodListData: {},
    socketMethodListData: {}
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LIST_API_METHOD:
            return {
                ...state,
                loading: true,
                apiMethodListData: {},
                addApiMethodData: {},
                updateApiMethodData: {}
            };

        case LIST_API_METHOD_SUCCESS:
            return { ...state, loading: false, apiMethodListData: action.payload };

        case LIST_API_METHOD_FAILURE:
            return { ...state, loading: false, apiMethodListData: action.payload };

        case ADD_API_METHOD:
            return { ...state, loading_methods: true, addApiMethodData: {} };

        case ADD_API_METHOD_SUCCESS:
            return { ...state, loading_methods: false, addApiMethodData: action.payload };

        case ADD_API_METHOD_FAILURE:
            return { ...state, loading_methods: false, addApiMethodData: action.payload };

        case UPDATE_API_METHOD:
            return { ...state, loading_methods: true, updateApiMethodData: {} };

        case UPDATE_API_METHOD_SUCCESS:
            return { ...state, loading_methods: false, updateApiMethodData: action.payload };

        case UPDATE_API_METHOD_FAILURE:
            return { ...state, loading_methods: false, updateApiMethodData: action.payload };

        case LIST_SOCKET_METHOD:
            return {
                ...state,
                loading_methods: true,
                socketMethodListData: {}
            };

        case LIST_SOCKET_METHOD_SUCCESS:
            return { ...state, loading_methods: false, socketMethodListData: action.payload };

        case LIST_SOCKET_METHOD_FAILURE:
            return { ...state, loading_methods: false, socketMethodListData: action.payload };

        case LIST_SYSTEM_RESET_METHOD:
            return {
                ...state,
                loading_methods: true,
                resetMethodListData: {}
            };

        case LIST_SYSTEM_RESET_METHOD_SUCCESS:
            return { ...state, loading_methods: false, resetMethodListData: action.payload };

        case LIST_SYSTEM_RESET_METHOD_FAILURE:
            return { ...state, loading_methods: false, resetMethodListData: action.payload };

        default:
            return { ...state };
    }
};