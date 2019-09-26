import {
    //email que list 
    GET_EMAIL_QUE_LIST,
    GET_EMAIL_QUE_LIST_SUCCESS,
    GET_EMAIL_QUE_LIST_FAILURE,

    //email resend
    GET_RESEND_EMAIL,
    GET_RESEND_EMAIL_SUCCESS,
    GET_RESEND_EMAIL_FAILURE,

    //clear data
    CLEAR_EMAIL_QUE_DATA
} from "../ActionTypes";

//Redux action get email que list 
export const getEmailQue = (request) => ({
    type: GET_EMAIL_QUE_LIST,
    payload: request
});
//Redux action get Email que list success
export const getEmailQueSuccess = (response) => ({
    type: GET_EMAIL_QUE_LIST_SUCCESS,
    payload: response
});
//Redux action get Email que list Faillure
export const getEmailQueFailure = (error) => ({
    type: GET_EMAIL_QUE_LIST_FAILURE,
    payload: error
});

//Redux action get resend Email que
export const getResendEmail = (request) => ({
    type: GET_RESEND_EMAIL,
    payload: request
});
//Redux action get resend Email que Success
export const getResendEmailSuccess = (response) => ({
    type: GET_RESEND_EMAIL_SUCCESS,
    payload: response
});
//Redux action get resend Email que Failure
export const getResendEmailFailure = (error) => ({
    type: GET_RESEND_EMAIL_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearEmailQuedata = () => ({
    type: CLEAR_EMAIL_QUE_DATA,
});

