
//Import action types form type.js
import {

    //List Complain
    LIST_COMPLAIN,
    LIST_COMPLAIN_SUCCESS,
    LIST_COMPLAIN_FAILURE,

    //Add Complain
    ADD_COMPLAIN,
    ADD_COMPLAIN_SUCCESS,
    ADD_COMPLAIN_FAILURE,

    //View Complain
    GET_COMPLAIN_BY_ID,
    GET_COMPLAIN_BY_ID_SUCCESS,
    GET_COMPLAIN_BY_ID_FAILURE,

    //Replay Complain
    ADD_COMPLAIN_CLEAR,
    GET_COMPLAIN_TYPE,
    GET_COMPLAIN_TYPE_SUCCESS,
    GET_COMPLAIN_TYPE_FAILURE,
    REPLAY_SEND_FAILURE,
    REPLAY_SEND_SUCCESS,
    REPLAY_SEND,
    REPLAY_SEND_CLEAR,
    CLEAR_COMPLAIN_DATA
} from '../ActionTypes';

import { action } from '../GlobalActions';

/**
 * Redux Action To List Complain
 */
export const complainList = (payload) => ({
    type: LIST_COMPLAIN,
    payload: payload,
});

/**
 * Redux Action List Complain Success
 */
export const complainListSuccess = (list) => ({
    type: LIST_COMPLAIN_SUCCESS,
    payload: list
});

/**
 * Redux Action List Complain Failure
 */
export const complainListFailure = (error) => ({
    type: LIST_COMPLAIN_FAILURE,
    payload: error
});

/**
 * Redux Action To Add Complain
 */
export const addComplain = (data) => ({
    type: ADD_COMPLAIN,
    payload: data
});

/**
 * Redux Action Add Complain Success
 */
export const addComplainSuccess = (data) => ({
    type: ADD_COMPLAIN_SUCCESS,
    payload: data
});

/**
 * Redux Action Add Complain Failure
 */
export const addComplainFailure = (error) => ({
    type: ADD_COMPLAIN_FAILURE,
    payload: error
});

/**
 * Redux Action To Get Complain By Id
 */
export const getComplainById = (id) => ({
    type: GET_COMPLAIN_BY_ID,
    payload: id
});

/**
 * Redux Action Get Complain By Id Success
 */
export const getComplainByIdSuccess = (data) => ({
    type: GET_COMPLAIN_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action Get Complain By Id Failure
 */
export const getComplainByIdFailure = (error) => ({
    type: GET_COMPLAIN_BY_ID_FAILURE,
    payload: error
});

/**
 * Redux Action Get Complain Type
 */
export function getComplaintType() {
    return action(GET_COMPLAIN_TYPE)
}
/**
 * Redux Action Get Complain Type Success
 */
export function getComplaintTypeSuccess(data) {
    return action(GET_COMPLAIN_TYPE_SUCCESS, { data })
}
/**
 * Redux Action Get Complain Type Failure
 */
export function getComplaintTypeFailure() {
    return action(GET_COMPLAIN_TYPE_FAILURE)
}

/**
 * Redux Action to Clear Add Complain Data
 */
export const clearAddComplainData = () => ({
    type: ADD_COMPLAIN_CLEAR,
    payload: null
});


/**
 * Redux Action To Reply Complain
 */
export const replaySend = (payload) => ({
    type: REPLAY_SEND,
    payload: payload
});

/**
 * Redux Action to Reply Complain Success
 */
export const replaySendSuccess = (reply) => ({
    type: REPLAY_SEND_SUCCESS,
    payload: reply
});
/**
 * Redux Action to Reply Complain Failure
 */
export const replaySendFailure = () => ({
    type: REPLAY_SEND_FAILURE,
    payload: null
});

/**
 * Redux Action to Clear Relpy Send Data
 */
export const clearSendData = () => ({
    type: REPLAY_SEND_CLEAR,
    payload: null
});

/**
 * Redux Action to Clear Complain Data
 */
export const clearComplainData = () => ({
    type: CLEAR_COMPLAIN_DATA,
});