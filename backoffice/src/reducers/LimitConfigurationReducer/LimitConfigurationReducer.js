

/**
 *   Developer : Parth Andhariya
 *   Date : 25-03-2019
 *   Component: Limit Configuration reducer
 */
import {
    GET_LIMIT_CONFIGURATION,
    GET_LIMIT_CONFIGURATION_SUCCESS,
    GET_LIMIT_CONFIGURATION_FAILURE,
    ADD_LIMIT_CONFIGURATION,
    ADD_LIMIT_CONFIGURATION_SUCCESS,
    ADD_LIMIT_CONFIGURATION_FAILURE,
    UPDATE_LIMIT_CONFIGURATION,
    UPDATE_LIMIT_CONFIGURATION_SUCCESS,
    UPDATE_LIMIT_CONFIGURATION_FAILURE,
    GET_LIMIT_CONFIGURATION_BY_ID,
    GET_LIMIT_CONFIGURATION_BY_ID_SUCCESS,
    GET_LIMIT_CONFIGURATION_BY_ID_FAILURE,
    CHANGE_LIMIT_CONFIGURATION,
    CHANGE_LIMIT_CONFIGURATION_SUCCESS,
    CHANGE_LIMIT_CONFIGURATION_FAILURE
} from "Actions/types";

// initial state
const INIT_STATE = {
    loading: false,
    ListData: [],
    Data: {},
    DeleteData: {},
    getById: {}
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        //List Limit Configuration
        case GET_LIMIT_CONFIGURATION:
            return {
                ...state,
                loading: true,
                ListData: [],
                DeleteData: {},
                Data: {}
            };
        case GET_LIMIT_CONFIGURATION_SUCCESS:
            return {
                ...state,
                loading: false,
                ListData: action.payload.Details,
            };
        case GET_LIMIT_CONFIGURATION_FAILURE:
            return {
                ...state,
                loading: false,
                ListData: action.payload,
            };
        //Add Limit Configuration
        case ADD_LIMIT_CONFIGURATION:
            return {
                ...state,
                loading: true,
                DeleteData: {},
                Data: {}
            };
        case ADD_LIMIT_CONFIGURATION_SUCCESS:
            return {
                ...state,
                loading: false,
                Data: action.payload
            };
        case ADD_LIMIT_CONFIGURATION_FAILURE:
            return {
                ...state,
                loading: false,
                Data: action.payload,
            };
        //Update Limit Configuration
        case UPDATE_LIMIT_CONFIGURATION:
            return {
                ...state,
                loading: true,
                Data: {},
                DeleteData: {},
                getById: {}
            };
        case UPDATE_LIMIT_CONFIGURATION_SUCCESS:
            return {
                ...state,
                loading: false,
                Data: action.payload
            };
        case UPDATE_LIMIT_CONFIGURATION_FAILURE:
            return {
                ...state,
                loading: false,
                Data: action.payload,
            };
        //Get Limit Configuration
        case GET_LIMIT_CONFIGURATION_BY_ID:
            return {
                ...state,
                loading: true,
                DeleteData: {},
                getById: {},
            };

        case GET_LIMIT_CONFIGURATION_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                getById: action.payload
            };

        case GET_LIMIT_CONFIGURATION_BY_ID_FAILURE:
            return {
                ...state,
                loading: false,
                getById: action.payload
            };
        //Delete Limit Confuguration
        case CHANGE_LIMIT_CONFIGURATION:
            return {
                ...state,
                loading: true,
                DeleteData: {},
            };
        case CHANGE_LIMIT_CONFIGURATION_SUCCESS:
            return {
                ...state,
                loading: false,
                DeleteData: action.payload
            };
        case CHANGE_LIMIT_CONFIGURATION_FAILURE:
            return {
                ...state,
                loading: false,
                DeleteData: action.payload
            };
        default:
            return { ...state };
    }
};
