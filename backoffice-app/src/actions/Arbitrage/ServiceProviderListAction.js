import {

    ARBRITAGE_ADD_SERVICE_PROVIDER,
    ARBRITAGE_ADD_SERVICE_PROVIDER_SUCCESS,
    ARBRITAGE_ADD_SERVICE_PROVIDER_FAILURE,

    ARBRITAGE_UPDATE_SERVICE_PROVIDER,
    ARBRITAGE_UPDATE_SERVICE_PROVIDER_SUCCESS,
    ARBRITAGE_UPDATE_SERVICE_PROVIDER_FAILURE

} from "../ActionTypes";

//For Add Service Provider

// Redux action for Add Service Provider in Arbritage Configuration
export const addArbitrageServiceProvider = (request) => ({
    type: ARBRITAGE_ADD_SERVICE_PROVIDER,
    payload: request
});

// Redux action for Add Service Provider Success in Arbritage Configuration
export const addArbitrageServiceProviderSuccess = (response) => ({
    type: ARBRITAGE_ADD_SERVICE_PROVIDER_SUCCESS,
    payload: response
});

// Redux action for Add Service Provider Fail in Arbritage Configuration
export const addArbitrageServiceProviderFailure = (error) => ({
    type: ARBRITAGE_ADD_SERVICE_PROVIDER_FAILURE,
    payload: error
});

// Redux action for Update Service Provider in Arbritage Configuration
export const updateArbitrageServiceProvider = (request) => ({
    type: ARBRITAGE_UPDATE_SERVICE_PROVIDER,
    payload: request
});

// Redux action for Update Service Provider Success in Arbritage Configuration
export const updateArbitrageServiceProviderSuccess = (response) => ({
    type: ARBRITAGE_UPDATE_SERVICE_PROVIDER_SUCCESS,
    payload: response
});

// Redux action for Update Service Provider Fail in Arbritage Configuration
export const updateArbitrageServiceProviderFailure = (error) => ({
    type: ARBRITAGE_UPDATE_SERVICE_PROVIDER_FAILURE,
    payload: error
});
