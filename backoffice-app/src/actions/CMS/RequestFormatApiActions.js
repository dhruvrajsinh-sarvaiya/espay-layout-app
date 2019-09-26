import {
    //add request format 
    ADD_REQUEST_FORMAT,
    ADD_REQUEST_FORMAT_SUCCESS,
    ADD_REQUEST_FORMAT_FAILURE,

    //edit request format
    EDIT_REQUEST_FORMAT,
    EDIT_REQUEST_FORMAT_SUCCESS,
    EDIT_REQUEST_FORMAT_FAILURE,

    //clear data
    CLEAR_REQUEST_FORMAT_DATA
} from "../ActionTypes";

//Redux action get add request format 
export const addRequestFormat = (request) => ({
    type: ADD_REQUEST_FORMAT,
    request: request
});
//Redux action get add request format  Success
export const addRequestFormatSuccess = (response) => ({
    type: ADD_REQUEST_FORMAT_SUCCESS,
    response: response
});
//Redux action get add request format  Failure
export const addRequestFormatFailure = (error) => ({
    type: ADD_REQUEST_FORMAT_FAILURE,
    response: error
});

//Redux action get edit request format
export const editRequestFormat = (request) => ({
    type: EDIT_REQUEST_FORMAT,
    request: request
});
//Redux action get edit request format Success
export const editRequestFormatSuccess = (response) => ({
    type: EDIT_REQUEST_FORMAT_SUCCESS,
    response: response
});
//Redux action get edit request format Failure
export const editRequestFormatFailure = (error) => ({
    type: EDIT_REQUEST_FORMAT_FAILURE,
    response: error
});

//Redux action  for clear response
export const clearRequestFormatApiData = () => ({
    type: CLEAR_REQUEST_FORMAT_DATA,
});

