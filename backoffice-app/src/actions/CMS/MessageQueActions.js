import {
    //message que list 
    GET_MESSAGE_QUE_LIST,
    GET_MESSAGE_QUE_LIST_SUCCESS,
    GET_MESSAGE_QUE_LIST_FAILURE,

    //message que resend
    GET_RESEND_MESSAGE,
    GET_RESEND_MESSAGE_SUCCESS,
    GET_RESEND_MESSAGE_FAILURE,

    //clear data
    CLEAR_MESSAGE_QUE_DATA
} from "../ActionTypes";

//Redux action get message que list 
export const getMessageQue = (request) => ({
    type: GET_MESSAGE_QUE_LIST,
    payload: request
});
//Redux action get message que list success
export const getMessageQueSuccess = (response) => ({
    type: GET_MESSAGE_QUE_LIST_SUCCESS,
    payload: response
});
//Redux action get message que list Faillure
export const getMessageQueFailure = (error) => ({
    type: GET_MESSAGE_QUE_LIST_FAILURE,
    payload: error
});

//Redux action get resend message que
export const getResendMessage = (request) => ({
    type: GET_RESEND_MESSAGE,
    payload: request
});
//Redux action get resend message que Success
export const getResendMessageSuccess = (response) => ({
    type: GET_RESEND_MESSAGE_SUCCESS,
    payload: response
});
//Redux action get resend message que Failure
export const getResendMessageFailure = (error) => ({
    type: GET_RESEND_MESSAGE_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearMessageQueData = () => ({
    type: CLEAR_MESSAGE_QUE_DATA,
});

