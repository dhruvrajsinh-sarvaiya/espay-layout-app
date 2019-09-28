/**
 * Reducer For Service Provider CRUD Operation 
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
    SERVICE_PROVIDER_CLEAR,
    ACTION_LOGOUT
} from "../../actions/ActionTypes";

const INIT_STATE = {
    loading: false,
    loadingUpdate: false,
    listServiceProviderData: null,
    addServiceProviderData: null,
    updateServiceProviderData: null
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INIT_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INIT_STATE

        //Handle service provider list method data
        case LIST_SERVICE_PROVIDER:
            return Object.assign({}, state, {
                loading: true,
                listServiceProviderData: null,
                addServiceProviderData: null,
                updateServiceProviderData: null
            })
        //Set service provider list method success data
        case LIST_SERVICE_PROVIDER_SUCCESS:
            return Object.assign({}, state, { loading: false, listServiceProviderData: action.payload })
        //Set service provider list method failure data
        case LIST_SERVICE_PROVIDER_FAILURE:
            return Object.assign({}, state, { loading: false, listServiceProviderData: action.payload })

        //Handle service provider add method data
        case ADD_SERVICE_PROVIDER:
            return Object.assign({}, state, { loading: true, addServiceProviderData: null })
        //Set service provider add method success data
        case ADD_SERVICE_PROVIDER_SUCCESS:
            return Object.assign({}, state, { loading: false, addServiceProviderData: action.payload })
        //Set service provider add method failure data
        case ADD_SERVICE_PROVIDER_FAILURE:
            return Object.assign({}, state, { loading: false, addServiceProviderData: action.payload })

        //Handle service provider update method data
        case UPDATE_SERVICE_PROVIDER:
            return Object.assign({}, state, { loadingUpdate: true, updateServiceProviderData: null })
        //Set service provider update method success data
        case UPDATE_SERVICE_PROVIDER_SUCCESS:
            return Object.assign({}, state, { loadingUpdate: false, updateServiceProviderData: action.payload })
        //Set service provider update method failure data
        case UPDATE_SERVICE_PROVIDER_FAILURE:
            return Object.assign({}, state, { loadingUpdate: false, updateServiceProviderData: action.payload })

        //clear data
        case SERVICE_PROVIDER_CLEAR:
            return Object.assign({}, state, {
                loading: false,
                loadingUpdate: false,
                listServiceProviderData: null,
                addServiceProviderData: null,
                updateServiceProviderData: null
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
};