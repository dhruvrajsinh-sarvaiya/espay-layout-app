/**
 * Create By Sanjay
 * Date : 10/01/2019
 * Action For Aplication Configuration Dashboard
 */
import {
    ADD_APP_CONFIGURATION,
    ADD_APP_CONFIGURATION_SUCCESS,
    ADD_APP_CONFIGURATION_FAILURE,

    GET_DOMAIN_DATA,
    GET_DOMAIN_DATA_SUCCESS,
    GET_DOMAIN_DATA_FAILURE,

    GET_APPLICATION_LIST,
    GET_APPLICATION_LIST_SUCCESS,
    GET_APPLICATION_LIST_FAILURE,

    GET_APPLICATION_BY_ID,
    GET_APPLICATION_BY_ID_SUCCESS,
    GET_APPLICATION_BY_ID_FAILURE,

    GET_ALL_APPLICATION_DATA,
    GET_ALL_APPLICATION_DATA_SUCCESS,
    GET_ALL_APPLICATION_DATA_FAILURE,

    UPDATE_APP_CONFIGURATION_DATA,
    UPDATE_APP_CONFIGURATION_DATA_SUCCESS,
    UPDATE_APP_CONFIGURATION_DATA_FAILURE
} from "../types";

/* Redux Action To Add Application Config Data */
export const addAppConfiguration = (data) => ({
    type: ADD_APP_CONFIGURATION,
    payload: data
});

/* Redux Action To Add Application Config Data Success */
export const addAppConfigurationSuccess = (response) => ({
    type: ADD_APP_CONFIGURATION_SUCCESS,
    payload: response
});

/* Redux Action To Add Application Config Data Failure */
export const addAppConfigurationFailure = (error) => ({
    type: ADD_APP_CONFIGURATION_FAILURE,
    payload: error
});

/* Redux Action To Get Domain Data */
export const getAppDomainData = () => ({
    type: GET_DOMAIN_DATA
});

/* Redux Action To Get Domain Data Success */
export const getAppDomainDataSuccess = (response) => ({
    type: GET_DOMAIN_DATA_SUCCESS,
    payload: response
});

/* Redux Action To Get Domain Data Failure */
export const getAppDomainDataFailure = (error) => ({
    type: GET_DOMAIN_DATA_FAILURE,
    payload: error
});

/* Redux Action To Get Application Data */
export const getApplicationList = (listData) => ({
    type: GET_APPLICATION_LIST,
    payload: listData
});

/* Redux Action To Get Application Data Success */
export const getApplicationListSuccess = (response) => ({
    type: GET_APPLICATION_LIST_SUCCESS,
    payload: response
});

/* Redux Action To Get Application Data Failure */
export const getApplicationListFailure = (error) => ({
    type: GET_APPLICATION_LIST_FAILURE,
    payload: error
});

/* Redux Action To Get Application Data By ID*/
export const getApplicationById = (Data) => ({
    type: GET_APPLICATION_BY_ID,
    payload: Data
});

/* Redux Action To Get Application Data By Id Success */
export const getApplicationByIdSuccess = (response) => ({
    type: GET_APPLICATION_BY_ID_SUCCESS,
    payload: response
});

/* Redux Action To Get Application Data By ID Failure */
export const getApplicationByIdFailure = (error) => ({
    type: GET_APPLICATION_BY_ID_FAILURE,
    payload: error
});

/* Redux Action To Get All Application Data */
export const getAllApplicationData = () => ({
    type: GET_ALL_APPLICATION_DATA
});

/* Redux Action To Get All Application Data Success */
export const getAllApplicationDataSuccess = (response) => ({
    type: GET_ALL_APPLICATION_DATA_SUCCESS,
    payload: response
});

/* Redux Action To GetAll Application Data Failure */
export const getAllApplicationDataFailure = (error) => ({
    type: GET_ALL_APPLICATION_DATA_FAILURE,
    payload: error
});

/* Redux Action To Update Application Data */
export const updateApplicationData = (request) => ({
    type: UPDATE_APP_CONFIGURATION_DATA,
    payload: request
});

/* Redux Action To Update Application Data Success */
export const updateApplicationDataSuccess = (response) => ({
    type: UPDATE_APP_CONFIGURATION_DATA_SUCCESS,
    payload: response
});

/* Redux Action To Update Application Data Failure */
export const updateApplicationDataFailure = (error) => ({
    type: UPDATE_APP_CONFIGURATION_DATA_FAILURE,
    payload: error
});