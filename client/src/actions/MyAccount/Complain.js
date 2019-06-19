/**
 * Auther : Salim Deraiya
 * Created : 03/10/2018
 * Complain Actions
 */

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
    REPLAY_COMPLAIN,
    REPLAY_COMPLAIN_SUCCESS,
    REPLAY_COMPLAIN_FAILURE,

    //Get Complain Type
    GET_COMPLAIN_TYPE,
    GET_COMPLAIN_TYPE_SUCCESS,
    GET_COMPLAIN_TYPE_FAILURE,

    //Get Complain Priority
    GET_COMPLAIN_PRIORITY,
    GET_COMPLAIN_PRIORITY_SUCCESS,
    GET_COMPLAIN_PRIORITY_FAILURE,

} from '../types';



/**
 * Redux Action To List Complain
 */
export const complainList = (getList) => ({
    type: LIST_COMPLAIN,
    payload: getList
});

/**
 * Redux Action List Complain Success
 */
export const complainListSuccess = (getList) => ({
    type: LIST_COMPLAIN_SUCCESS,
    payload: getList
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
export const getComplainById = (list) => ({
    type: GET_COMPLAIN_BY_ID,
    payload: list
});

/**
 * Redux Action Get Complain By Id Success
 */
export const getComplainByIdSuccess = (list) => ({
    type: GET_COMPLAIN_BY_ID_SUCCESS,
    payload: list
});

/**
 * Redux Action Get Complain By Id Failure
 */
export const getComplainByIdFailure = (error) => ({
    type: GET_COMPLAIN_BY_ID_FAILURE,
    payload: error
});

/**
 * Redux Action To Replay Complain
 */
export const replayComplain = (data) => ({
    type: REPLAY_COMPLAIN,
    payload: data
});

/**
 * Redux Action Replay Complain Success
 */
export const replayComplainSuccess = (data) => ({
    type: REPLAY_COMPLAIN_SUCCESS,
    payload: data
});

/**
 * Redux Action Replay Complain Failure
 */
export const replayComplainFailure = (error) => ({
    type: REPLAY_COMPLAIN_FAILURE,
    payload: error
});

/**
 * Redux Action To Get Complain Type
 */
export const getComplainType = () => ({
    type: GET_COMPLAIN_TYPE,
});

/**
 * Redux Action Get Complain Type Success
 */
export const getComplainTypeSuccess = (data) => ({
    type: GET_COMPLAIN_TYPE_SUCCESS,
    payload: data
});

/**
 * Redux Action Get Complain Type Failure
 */
export const getComplainTypeFailure = (error) => ({
    type: GET_COMPLAIN_TYPE_FAILURE,
    payload: error
});

/**
 * Redux Action To Get Complain Priority
 */
export const getComplainPriority = () => ({
    type: GET_COMPLAIN_PRIORITY,
});

/**
 * Redux Action Get Complain Priority Success
 */
export const getComplainPrioritySuccess = (data) => ({
    type: GET_COMPLAIN_PRIORITY_SUCCESS,
    payload: data
});

/**
 * Redux Action Get Complain Priority Failure
 */
export const getComplainPriorityFailure = (error) => ({
    type: GET_COMPLAIN_PRIORITY_FAILURE,
    payload: error
});