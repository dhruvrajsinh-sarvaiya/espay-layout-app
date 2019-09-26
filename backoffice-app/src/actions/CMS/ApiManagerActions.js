import {
    //email api manager list 
    GET_EMAIL_API_MANAGER_LIST,
    GET_EMAIL_API_MANAGER_LIST_SUCCESS,
    GET_EMAIL_API_MANAGER_LIST_FAILURE,

    //add email api manager
    ADD_EMAIL_API_MANAGER,
    ADD_EMAIL_API_MANAGER_SUCCESS,
    ADD_EMAIL_API_MANAGER_FAILURE,

    //edit email api manager
    EDIT_EMAIL_API_MANAGER,
    EDIT_EMAIL_API_MANAGER_SUCCESS,
    EDIT_EMAIL_API_MANAGER_FAILURE,

    //get request format
    GET_REQUEST_FORMAT,
    GET_REQUEST_FORMAT_SUCCESS,
    GET_REQUEST_FORMAT_FAILURE,

    //clear data
    CLEAR_API_MANAGER_DATA
} from "../ActionTypes";

//Redux action get email api manager list 
export const getEmailApiManagerList = (request) => ({
    type: GET_EMAIL_API_MANAGER_LIST,
    payload: request
});
//Redux action get email api manager list success
export const getEmailApiManagerListSuccess = (response) => ({
    type: GET_EMAIL_API_MANAGER_LIST_SUCCESS,
    payload: response
});
//Redux action get email api manager list Faillure
export const getEmailApiManagerListFailure = (error) => ({
    type: GET_EMAIL_API_MANAGER_LIST_FAILURE,
    payload: error
});

//Redux action get add email api manager
export const addEmailApiManager = (request) => ({
    type: ADD_EMAIL_API_MANAGER,
    payload: request
});
//Redux action get add email api manager Success
export const addEmailApiManagerSuccess = (response) => ({
    type: ADD_EMAIL_API_MANAGER_SUCCESS,
    payload: response
});
//Redux action get add email api manager Failure
export const addEmailApiManagerFailure = (error) => ({
    type: ADD_EMAIL_API_MANAGER_FAILURE,
    payload: error
});

//Redux action get edit email api manager
export const editEmailApiManager = (request) => ({
    type: EDIT_EMAIL_API_MANAGER,
    payload: request
});
//Redux action get edit email api manager Success
export const editEmailApiManagerSuccess = (response) => ({
    type: EDIT_EMAIL_API_MANAGER_SUCCESS,
    payload: response
});
//Redux action get edit email api manager Failure
export const editEmailApiManagerFailure = (error) => ({
    type: EDIT_EMAIL_API_MANAGER_FAILURE,
    payload: error
});

//Redux action get get all Request format
export const getAllRequestFormat = (request) => ({
    type: GET_REQUEST_FORMAT,
    payload: request
});
//Redux action get get all Request format Success
export const getAllRequestFormatSuccess = (response) => ({
    type: GET_REQUEST_FORMAT_SUCCESS,
    payload: response
});
//Redux action get get all Request format Failure
export const getAllRequestFormatFailure = (error) => ({
    type: GET_REQUEST_FORMAT_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearApiManagerData = () => ({
    type: CLEAR_API_MANAGER_DATA,
});

