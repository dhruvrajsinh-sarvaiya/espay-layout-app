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
    CLEAR_ARBITAGE_SERVICE_PROVIDER_DATA,

    // Action Logout
    ACTION_LOGOUT,
} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {
    //arbitage service provider list
    listFetching: false,
    serviceProviderData: null,

    //arbitage service provider add
    addProvderFetching: false,
    addProvderData: null,

    //arbitage service provider edit
    updateProvderFetching: false,
    updateProvderData: null,
}

export default function ArbiServiceProviderConfigReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        //clear data 
        case CLEAR_ARBITAGE_SERVICE_PROVIDER_DATA:
            return INITIAL_STATE

        //arbitage service provider list
        case LIST_ARBITAGE_SERVICE_PROVIDER:
            return { ...state, listFetching: true, serviceProviderData: null };
        //arbitage service provider list success
        case LIST_ARBITAGE_SERVICE_PROVIDER_SUCCESS:
            return { ...state, listFetching: false, serviceProviderData: action.payload };
        //arbitage service provider list failure
        case LIST_ARBITAGE_SERVICE_PROVIDER_FAILURE:
            return { ...state, listFetching: false, serviceProviderData: action.payload };

        //arbitage service provider add
        case ADD_ARBITAGE_SERVICE_PROVIDER:
            return { ...state, addProvderFetching: true, addProvderData: null };
        //arbitage service provider add success
        case ADD_ARBITAGE_SERVICE_PROVIDER_SUCCESS:
            return { ...state, addProvderFetching: false, addProvderData: action.payload };
        //arbitage service provider add failure
        case ADD_ARBITAGE_SERVICE_PROVIDER_FAILURE:
            return { ...state, addProvderFetching: false, addProvderData: action.payload };

        //arbitage service provider update
        case UPDATE_ARBITAGE_SERVICE_PROVIDER:
            return { ...state, updateProvderFetching: true, updateProvderData: null };
        //arbitage service provider update success
        case UPDATE_ARBITAGE_SERVICE_PROVIDER_SUCCESS:
            return { ...state, updateProvderFetching: false, updateProvderData: action.payload };
        //arbitage service provider update failure
        case UPDATE_ARBITAGE_SERVICE_PROVIDER_FAILURE:
            return { ...state, updateProvderFetching: false, updateProvderData: action.payload };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}