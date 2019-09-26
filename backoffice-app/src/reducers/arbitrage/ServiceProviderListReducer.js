import {
    // Action Logout
    ACTION_LOGOUT,

    //List Service Provider
    GET_ARBITRAGE_PROVIDER_LIST,
    GET_ARBITRAGE_PROVIDER_LIST_SUCCESS,
    GET_ARBITRAGE_PROVIDER_LIST_FAILURE,

    //Add Service Provider
    ARBRITAGE_ADD_SERVICE_PROVIDER,
    ARBRITAGE_ADD_SERVICE_PROVIDER_SUCCESS,
    ARBRITAGE_ADD_SERVICE_PROVIDER_FAILURE,

    //Update Service Provider
    ARBRITAGE_UPDATE_SERVICE_PROVIDER,
    ARBRITAGE_UPDATE_SERVICE_PROVIDER_SUCCESS,
    ARBRITAGE_UPDATE_SERVICE_PROVIDER_FAILURE

} from "../../actions/ActionTypes";

// Initial State for Service Provider List
const INITIAL_STATE = {

    // for Service Provider List
    ServiceProviderdata: null,
    ServiceProviderIsFetching: false,
    ServiceProviderListError: false,

    // for Add Service Provider List
    AddServiceProviderdata: null,
    AddServiceProviderIsFetching: false,
    AddServiceProviderError: false,

    // for update Service Provider List
    updateServiceProviderdata: null,
    updateServiceProviderIsFetching: false,
    UpdateServiceProviderError: false,
}

export default function ServiceProviderListReducer(state, action) {
    
    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Service Provider List method data
        case GET_ARBITRAGE_PROVIDER_LIST:
            return Object.assign({}, state, {
                ServiceProviderdata: null,
                ServiceProviderIsFetching: true,
            })

        // Set Service Provider List success data
        case GET_ARBITRAGE_PROVIDER_LIST_SUCCESS:
            return Object.assign({}, state, {
                ServiceProviderdata: action.payload,
                ServiceProviderIsFetching: false,
            })

        // Set Service Provider List Failue data
        case GET_ARBITRAGE_PROVIDER_LIST_FAILURE:
            return Object.assign({}, state, {
                ServiceProviderdata: null,
                ServiceProviderIsFetching: false,
                ServiceProviderListError: true,
            })


        // Handle Add Service Provider method data
        case ARBRITAGE_ADD_SERVICE_PROVIDER:
            return Object.assign({}, state, {
                AddServiceProviderdata: null,
                AddServiceProviderIsFetching: true,
            })

        // Set Add Service Provider success data
        case ARBRITAGE_ADD_SERVICE_PROVIDER_SUCCESS:
            return Object.assign({}, state, {
                AddServiceProviderdata: action.payload,
                AddServiceProviderIsFetching: false,
            })

        // Set Add Service Provider failure data
        case ARBRITAGE_ADD_SERVICE_PROVIDER_FAILURE:
            return Object.assign({}, state, {
                AddServiceProviderdata: null,
                AddServiceProviderIsFetching: false,
                AddServiceProviderError: true,
            })

        // Handle Update Service Provider method data
        case ARBRITAGE_UPDATE_SERVICE_PROVIDER:
            return Object.assign({}, state, {
                UpdateServiceProviderdata: null,
                updateServiceProviderIsFetching: true,
            })

        // Set Update Service Provider success data
        case ARBRITAGE_UPDATE_SERVICE_PROVIDER_SUCCESS:
            return Object.assign({}, state, {
                UpdateServiceProviderdata: action.payload,
                updateServiceProviderIsFetching: false,
            })

        // Set Update Service Provider Failure data
        case ARBRITAGE_UPDATE_SERVICE_PROVIDER_FAILURE:
            return Object.assign({}, state, {
                UpdateServiceProviderdata: null,
                updateServiceProviderIsFetching: false,
                UpdateServiceProviderError: true,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}