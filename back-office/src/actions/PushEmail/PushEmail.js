import {
    EMAIL_PUSH,
    EMAIL_PUSH_SUCCESS,
    EMAIL_PUSH_FAIL,
}from '../types';

export const PushEmailRequest= data => ({
    type: EMAIL_PUSH,
    payload: data
})

export const PushEmailSuccess=response=>({
    type: EMAIL_PUSH_SUCCESS,
    payload: response
})

export const PushEmailFail=error=>({
    type: EMAIL_PUSH_FAIL,
    payload: error
})
