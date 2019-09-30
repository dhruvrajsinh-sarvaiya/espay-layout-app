/**
 * Actions For Service Provider CRUD Operation
 */
import {
    //Service provider list
    LIST_SERVICE_PROVIDER,
    LIST_SERVICE_PROVIDER_SUCCESS,
    LIST_SERVICE_PROVIDER_FAILURE,

    //Service provider add 
    ADD_SERVICE_PROVIDER,
    ADD_SERVICE_PROVIDER_SUCCESS,
    ADD_SERVICE_PROVIDER_FAILURE,

    //Service provider update 
    UPDATE_SERVICE_PROVIDER,
    UPDATE_SERVICE_PROVIDER_SUCCESS,
    UPDATE_SERVICE_PROVIDER_FAILURE,

    //clear data
    SERVICE_PROVIDER_CLEAR
} from "../ActionTypes";

//Redux action For Display Service Provider List
export const listServiceProvider = () => ({
    type: LIST_SERVICE_PROVIDER
});
//Redux action For Display Service Provider List success
export const listServiceProviderSuccess = (response) => ({
    type: LIST_SERVICE_PROVIDER_SUCCESS,
    payload: response
});
//Redux action For Display Service Provider List failure
export const listServiceProviderFailure = (error) => ({
    type: LIST_SERVICE_PROVIDER_FAILURE,
    payload: error
});

//Redux action For Add Service Provider
export const addServiceProvider = (request) => ({
    type: ADD_SERVICE_PROVIDER,
    payload: request
});
//Redux action For Add Service Provider success
export const addServiceProviderSuccess = (response) => ({
    type: ADD_SERVICE_PROVIDER_SUCCESS,
    payload: response
});
//Redux action For Add Service Provider failure
export const addServiceProviderFailure = (error) => ({
    type: ADD_SERVICE_PROVIDER_FAILURE,
    payload: error
});

//Redux action For Edit Service Provider
export const updateServiceProvider = (request) => ({
    type: UPDATE_SERVICE_PROVIDER,
    payload: request
});
//Redux action For Edit Service Provider success
export const updateServiceProviderSuccess = (response) => ({
    type: UPDATE_SERVICE_PROVIDER_SUCCESS,
    payload: response
});
//Redux action For Edit Service Provider failure
export const updateServiceProviderFailure = (error) => ({
    type: UPDATE_SERVICE_PROVIDER_FAILURE,
    payload: error
});

//Redux action For clear reducer of service provider
export const clearServiceProvider = () => ({
    type: SERVICE_PROVIDER_CLEAR,
});
