// Actions For get Api Key Data List By Tejas 26/2/2019

// import types
import {
    GET_API_KEY_LIST,
    GET_API_KEY_LIST_SUCCESS,
    GET_API_KEY_LIST_FAILURE,
    ADD_IP_ADDRESS,
    ADD_IP_ADDRESS_SUCCESS,
    ADD_IP_ADDRESS_FAILURE,
    UPDATE_API_KEY_LIST,
    UPDATE_API_KEY_LIST_SUCCESS,
    UPDATE_API_KEY_LIST_FAILURE,
    GENERATE_API_KEY,
    GENERATE_API_KEY_SUCCESS,
    GENERATE_API_KEY_FAILURE,
    DELETE_API_KEY,
    DELETE_API_KEY_SUCCESS,
    DELETE_API_KEY_FAILURE,
    GET_IP_WHITELIST_DATA,
    GET_IP_WHITELIST_DATA_SUCCESS,
    GET_IP_WHITELIST_DATA_FAILURE,
    REMOVE_IP_ADDRESS,
    REMOVE_IP_ADDRESS_SUCCESS,
    REMOVE_IP_ADDRESS_FAILURE,
    GET_API_KEY_BY_ID,
    GET_API_KEY_BY_ID_SUCCESS,
    GET_API_KEY_BY_ID_FAILURE,

} from "Actions/types";

//action for Get Api Key List and set type for reducers
export const getApiKeyList = Data => ({
    type: GET_API_KEY_LIST,
    payload: Data
});

//action for set Success and Get Api Key List and set type for reducers
export const getApiKeyListSuccess = response => ({
    type: GET_API_KEY_LIST_SUCCESS,
    payload: response
});

//action for set failure and error to Get Api Key List and set type for reducers
export const getApiKeyListFailure = error => ({
    type: GET_API_KEY_LIST_FAILURE,
    payload: error
});


//action for Add IP Address and set type for reducers
export const addIPAddress = Data => ({
    type: ADD_IP_ADDRESS,
    payload: Data
});

//action for set Success and Add IP Address and set type for reducers
export const addIPAddressSuccess = response => ({
    type: ADD_IP_ADDRESS_SUCCESS,
    payload: response
});

//action for set failure and error to Add IP Address and set type for reducers
export const addIPAddressFailure = error => ({
    type: ADD_IP_ADDRESS_FAILURE,
    payload: error
});

//action for Remove IP Address and set type for reducers
export const removeIPAddress = Data => ({
    type: REMOVE_IP_ADDRESS,
    payload: Data
});

//action for set Success and Remove IP Address and set type for reducers
export const removeIPAddressSuccess = response => ({
    type: REMOVE_IP_ADDRESS_SUCCESS,
    payload: response
});

//action for set failure and error to Remove IP Address and set type for reducers
export const removeIPAddressFailure = error => ({
    type: REMOVE_IP_ADDRESS_FAILURE,
    payload: error
});

//action for Update Api Key and set type for reducers
export const updateApiKeyList = Data => ({
    type: UPDATE_API_KEY_LIST,
    payload: Data
});

//action for set Success and Update Api Key and set type for reducers
export const updateApiKeyListSuccess = response => ({
    type: UPDATE_API_KEY_LIST_SUCCESS,
    payload: response
});

//action for set failure and error to Update Api Key and set type for reducers
export const updateApiKeyListFailure = error => ({
    type: UPDATE_API_KEY_LIST_FAILURE,
    payload: error
});

//action for Generate Api Key and set type for reducers
export const generateApiKey = Data => ({
    type: GENERATE_API_KEY,
    payload: Data
});

//action for set Success and Generate Api Key and set type for reducers
export const generateApiKeySuccess = response => ({
    type: GENERATE_API_KEY_SUCCESS,
    payload: response
});

//action for set failure and error to Generate Api Key and set type for reducers
export const generateApiKeyFailure = error => ({
    type: GENERATE_API_KEY_FAILURE,
    payload: error
});

//action for delete Api Key and set type for reducers
export const deleteApiKey = Data => ({
    type: DELETE_API_KEY,
    payload: Data
});

//action for set Success and delete Api Key and set type for reducers
export const deleteApiKeySuccess = response => ({
    type: DELETE_API_KEY_SUCCESS,
    payload: response
});

//action for set failure and error to delete Api Key and set type for reducers
export const deleteApiKeyFailure = error => ({
    type: DELETE_API_KEY_FAILURE,
    payload: error
});

//action for Get Ip WhiteList Dataand set type for reducers
export const getIpWhiteListdata = Data => ({
    type: GET_IP_WHITELIST_DATA,
    payload: Data
});

//action for set Success and Get Ip WhiteList Dataand set type for reducers
export const getIpWhiteListdataSuccess = response => ({
    type: GET_IP_WHITELIST_DATA_SUCCESS,
    payload: response
});

//action for set failure and error to Get Ip WhiteList Dataand set type for reducers
export const getIpWhiteListdataFailure = error => ({
    type: GET_IP_WHITELIST_DATA_FAILURE,
    payload: error
});

//action for Get Api Key List bY kEY id  and set type for reducers
export const getApiKeyByID = Data => ({
    type: GET_API_KEY_BY_ID,
    payload: Data
});

//action for set Success and Get Api Key List bY kEY id  and set type for reducers
export const getApiKeyByIDSuccess = response => ({
    type: GET_API_KEY_BY_ID_SUCCESS,
    payload: response
});

//action for set failure and error to Get Api Key List bY kEY id  and set type for reducers
export const getApiKeyByIDFailure = error => ({
    type: GET_API_KEY_BY_ID_FAILURE,
    payload: error
});