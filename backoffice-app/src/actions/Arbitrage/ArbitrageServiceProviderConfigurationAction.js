import {
    //arbitage service provider list
    LIST_ARBITAGE_SERVICE_PROVIDER,
    LIST_ARBITAGE_SERVICE_PROVIDER_SUCCESS,
    LIST_ARBITAGE_SERVICE_PROVIDER_FAILURE,

    //arbitage service provider add
    ADD_ARBITAGE_SERVICE_PROVIDER,
    ADD_ARBITAGE_SERVICE_PROVIDER_SUCCESS,
    ADD_ARBITAGE_SERVICE_PROVIDER_FAILURE,

    //arbitage service provider edit
    UPDATE_ARBITAGE_SERVICE_PROVIDER,
    UPDATE_ARBITAGE_SERVICE_PROVIDER_SUCCESS,
    UPDATE_ARBITAGE_SERVICE_PROVIDER_FAILURE,

    //clear data
    CLEAR_ARBITAGE_SERVICE_PROVIDER_DATA
} from '../ActionTypes'

//get arbitage service provider list 
export const listArbitageServiceProvider = (request) => ({
    type: LIST_ARBITAGE_SERVICE_PROVIDER,
    payload: request
});
//get arbitage service provider list success
export const listArbitageServiceProviderSuccess = (response) => ({
    type: LIST_ARBITAGE_SERVICE_PROVIDER_SUCCESS,
    payload: response
});
//get arbitage service provider list failure
export const listArbitageServiceProviderFailure = (error) => ({
    type: LIST_ARBITAGE_SERVICE_PROVIDER_FAILURE,
    payload: error
});

//get arbitage service provider add 
export const addArbitageServiceProvider = (request) => ({
    type: ADD_ARBITAGE_SERVICE_PROVIDER,
    payload: request
});
//get arbitage service provider add success
export const addArbitageServiceProviderSuccess = (response) => ({
    type: ADD_ARBITAGE_SERVICE_PROVIDER_SUCCESS,
    payload: response
});
//get arbitage service provider add failure
export const addArbitageServiceProviderFailure = (error) => ({
    type: ADD_ARBITAGE_SERVICE_PROVIDER_FAILURE,
    payload: error
});

//get arbitage service provider update 
export const updateArbitageServiceProvider = (request) => ({
    type: UPDATE_ARBITAGE_SERVICE_PROVIDER,
    payload: request
});
//get arbitage service provider update success
export const updateArbitageServiceProviderSuccess = (response) => ({
    type: UPDATE_ARBITAGE_SERVICE_PROVIDER_SUCCESS,
    payload: response
});
//get arbitage service provider update failure
export const updateArbitageServiceProviderFailure = (error) => ({
    type: UPDATE_ARBITAGE_SERVICE_PROVIDER_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearArbitageServiceProviderData = () => ({
    type: CLEAR_ARBITAGE_SERVICE_PROVIDER_DATA,
});
