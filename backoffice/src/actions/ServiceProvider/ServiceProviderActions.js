/**
 * Create By Sanjay 
 * Created Date 25/03/2019
 * Actions For Service Provider CRUD Operation
 */

import {

    LIST_SERVICE_PROVIDER,
    LIST_SERVICE_PROVIDER_SUCCESS,
    LIST_SERVICE_PROVIDER_FAILURE,

    ADD_SERVICE_PROVIDER,
    ADD_SERVICE_PROVIDER_SUCCESS,
    ADD_SERVICE_PROVIDER_FAILURE,

    UPDATE_SERVICE_PROVIDER,
    UPDATE_SERVICE_PROVIDER_SUCCESS,
    UPDATE_SERVICE_PROVIDER_FAILURE

} from "../types";

//For Display Service Provider List

export const listServiceProvider = (request) => ({
    type: LIST_SERVICE_PROVIDER,
    payload: request
});

export const listServiceProviderSuccess = (response) => ({
    type: LIST_SERVICE_PROVIDER_SUCCESS,
    payload: response
});

export const listServiceProviderFailure = (error) => ({
    type: LIST_SERVICE_PROVIDER_FAILURE,
    payload: error
});

//For Add Service Provider

export const addServiceProvider = (request) => ({
    type: ADD_SERVICE_PROVIDER,
    payload: request
});

export const addServiceProviderSuccess = (response) => ({
    type: ADD_SERVICE_PROVIDER_SUCCESS,
    payload: response
});

export const addServiceProviderFailure = (error) => ({
    type: ADD_SERVICE_PROVIDER_FAILURE,
    payload: error
});

//For Edit Service Provider

export const updateServiceProvider = (request) => ({
    type: UPDATE_SERVICE_PROVIDER,
    payload: request
});

export const updateServiceProviderSuccess = (response) => ({
    type: UPDATE_SERVICE_PROVIDER_SUCCESS,
    payload: response
});

export const updateServiceProviderFailure = (error) => ({
    type: UPDATE_SERVICE_PROVIDER_FAILURE,
    payload: error
});
