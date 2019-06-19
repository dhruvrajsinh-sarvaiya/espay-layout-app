// Actions For Api Configuration By Tejas

// import types 
import {  
    GET_CONFIGURATION_LIST,
    GET_CONFIGURATION_LIST_SUCCESS,
    GET_CONFIGURATION_LIST_FAILURE,
    GET_PROVIDER_DATA_LIST,
    GET_PROVIDER_DATA_LIST_SUCCESS,
    GET_PROVIDER_DATA_LIST_FAILURE,
    ADD_CONFIGURATION_LIST,
    ADD_CONFIGURATION_LIST_SUCCESS,
    ADD_CONFIGURATION_LIST_FAILURE,
    UPDATE_CONFIGURATION_LIST,
    UPDATE_CONFIGURATION_LIST_SUCCESS,
    UPDATE_CONFIGURATION_LIST_FAILURE,
    DELETE_CONFIGURATION_LIST,
    DELETE_CONFIGURATION_LIST_SUCCESS,
    DELETE_CONFIGURATION_LIST_FAILURE,
} from 'Actions/types';

//action for Get Configuration List and set type for reducers
export const getConfigurationList = (Data) => ({
    type: GET_CONFIGURATION_LIST,
    payload: { Data }
});

//action for set Success and Get Configuration List and set type for reducers
export const getConfigurationListSuccess = (response) => ({
    type: GET_CONFIGURATION_LIST_SUCCESS,
    payload: response.data
});

//action for set failure and error to Get Configuration List and set type for reducers
export const getConfigurationListFailure = (error) => ({
    type: GET_CONFIGURATION_LIST_FAILURE,
    payload: error.message
});


//action for Get Provider List and set type for reducers
export const getProviderList = (Data) => ({
    type: GET_PROVIDER_DATA_LIST,
    payload: { Data }
});

//action for set Success and Get Provider List and set type for reducers
export const getProviderListSuccess = (response) => ({
    type: GET_PROVIDER_DATA_LIST_SUCCESS,
    payload: response.data
});

//action for set failure and error to Get Provider List and set type for reducers
export const getProviderListFailure = (error) => ({
    type: GET_PROVIDER_DATA_LIST_FAILURE,
    payload: error.message
});

//action for add Configuration List and set type for reducers
export const addConfigurationList = (Data) => ({
    type: ADD_CONFIGURATION_LIST,
    payload: { Data }
});

//action for set Success and add Configuration List and set type for reducers
export const addConfigurationListSuccess = (response) => ({
    type: ADD_CONFIGURATION_LIST_SUCCESS,
    payload: response.data
});

//action for set failure and error to add Configuration List and set type for reducers
export const addConfigurationListFailure = (error) => ({
    type: ADD_CONFIGURATION_LIST_FAILURE,
    payload: error.message
});


//action for UPDATE Configuration List and set type for reducers
export const updateConfigurationList = (Data) => ({
    type: UPDATE_CONFIGURATION_LIST,
    payload: { Data }
});

//action for set Success and UPDATE Configuration List and set type for reducers
export const updateConfigurationListSuccess = (response) => ({
    type: UPDATE_CONFIGURATION_LIST_SUCCESS,
    payload: response.data
});

//action for set failure and error to UPDATE Configuration List and set type for reducers
export const updateConfigurationListFailure = (error) => ({
    type: UPDATE_CONFIGURATION_LIST_FAILURE,
    payload: error.message
});


//action for delete Configuration List and set type for reducers
export const deleteConfigurationList = (Data) => ({
    type:DELETE_CONFIGURATION_LIST,
    payload: { Data }
});

//action for set Success and delete Configuration List and set type for reducers
export const deleteConfigurationListSuccess = (response) => ({
    type:DELETE_CONFIGURATION_LIST_SUCCESS,
    payload: response.data
});

//action for set failure and error to delete Configuration List and set type for reducers
export const deleteConfigurationListFailure = (error) => ({
    type:DELETE_CONFIGURATION_LIST_FAILURE,
    payload: error.message
});
