/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : Organization Information Actions
*/
import {
    GET_ORGANIZATION_INFO,
    GET_ORGANIZATION_INFO_SUCCESS,
    GET_ORGANIZATION_INFO_FAILURE,
    ADD_ORGANIZATION_INFO,
    ADD_ORGANIZATION_INFO_SUCCESS,
    ADD_ORGANIZATION_INFO_FAILURE,
    EDIT_ORGANIZATION_INFO,
    EDIT_ORGANIZATION_INFO_SUCCESS,
    EDIT_ORGANIZATION_INFO_FAILURE
} from "../types";

/**
 * Redux Action To Get Organization Data
 */
export const getOrganization = () => ({
    type: GET_ORGANIZATION_INFO
});

/**
 * Redux Action To Get Organization Data Success
 */
export const getOrganizationSuccess = (response) => ({
    type: GET_ORGANIZATION_INFO_SUCCESS,
    payload: response
});

/**
 * Redux Action To Get Organization Data Failure
 */
export const getOrganizationFailure = (error) => ({
    type: GET_ORGANIZATION_INFO_FAILURE,
    payload: error
});

/**
 * Redux Action To Add Organization Data
 */
export const addOrganization = (data) => ({
    type: ADD_ORGANIZATION_INFO,
    payload: data
});

/**
 * Redux Action To Add Organization Data Success
 */
export const addOrganizationSuccess = (response) => ({
    type: ADD_ORGANIZATION_INFO_SUCCESS,
    payload: response
});

/**
 * Redux Action To Add Organization Data Failure
 */
export const addOrganizationFailure = (error) => ({
    type: ADD_ORGANIZATION_INFO_FAILURE,
    payload: error
});

/**
 * Redux Action To Edit Organization Data
 */
export const editOrganization = (data) => ({
    type: EDIT_ORGANIZATION_INFO,
    payload: data
});

/**
 * Redux Action To Edit Organization Data Success
 */
export const editOrganizationSuccess = (response) => ({
    type: EDIT_ORGANIZATION_INFO_SUCCESS,
    payload: response
});

/**
 * Redux Action To Edit Organization Data Failure
 */
export const editOrganizationFailure = (error) => ({
    type: EDIT_ORGANIZATION_INFO_FAILURE,
    payload: error
});