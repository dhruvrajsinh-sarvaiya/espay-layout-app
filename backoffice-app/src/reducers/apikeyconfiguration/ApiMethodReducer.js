import {
    // Action Logout
    ACTION_LOGOUT,

    //Get list of api method
    LIST_API_METHOD,
    LIST_API_METHOD_SUCCESS,
    LIST_API_METHOD_FAILURE,

    // For add api method
    ADD_API_METHOD,
    ADD_API_METHOD_SUCCESS,
    ADD_API_METHOD_FAILURE,

    //For update api method 
    UPDATE_API_METHOD,
    UPDATE_API_METHOD_SUCCESS,
    UPDATE_API_METHOD_FAILURE,

    // For list system rest method 
    LIST_SYSTEM_REST_METHOD,
    LIST_SYSTEM_REST_METHOD_SUCCESS,
    LIST_SYSTEM_REST_METHOD_FAILURE,

    // For list system socket method 
    LIST_SOCKET_METHOD,
    LIST_SOCKET_METHOD_SUCCESS,
    LIST_SOCKET_METHOD_FAILURE,

    //Clear Reducer
    API_METHOD_CLEAR

} from "../../actions/ActionTypes";

// Initial State for Api method list
const INITIAL_STATE = {

    // For Api method list Data
    ApiMethodListData: null,
    ApiMethodListDataLoading: false,
    ApiMethodListDataError: false,

    // For Add Api method 
    AddApiMethodData: null,
    AddApiMethodDataLoading: false,
    AddApiMethodDataError: false,

    // For Get Api Plan Configuration List
    UpdateApiMethodData: null,
    UpdateApiMethodDataLoading: false,
    UpdateApiMethodDataError: false,

    // For System rest method List
    RestMethodListData: null,
    RestMethodListDataLoading: false,
    RestMethodListDataError: false,

    // For System Socket method List
    SocketMethodListData: null,
    SocketMethodListDataLoading: false,
    SocketMethodListDataError: false,
}

export default function ApiMethodReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle List Api Method 
        case LIST_API_METHOD:
            return Object.assign({}, state, {
                ApiMethodListData: null,
                ApiMethodListDataLoading: true
            })
        // Set List Api Method Success Data
        case LIST_API_METHOD_SUCCESS:
            return Object.assign({}, state, {
                ApiMethodListData: action.payload,
                ApiMethodListDataLoading: false,
            })
        // Set List Api Method Failure Data
        case LIST_API_METHOD_FAILURE:
            return Object.assign({}, state, {
                ApiMethodListData: null,
                ApiMethodListDataLoading: false,
                ApiMethodListDataError: true
            })

        // Handle Add Api Method 
        case ADD_API_METHOD:
            return Object.assign({}, state, {
                AddApiMethodData: null,
                AddApiMethodDataLoading: true
            })
        // Set Add Api Method Success Data
        case ADD_API_METHOD_SUCCESS:
            return Object.assign({}, state, {
                AddApiMethodData: action.payload,
                AddApiMethodDataLoading: false,
            })
        // Set Add Api Method Failure Data
        case ADD_API_METHOD_FAILURE:
            return Object.assign({}, state, {
                AddApiMethodData: null,
                AddApiMethodDataLoading: false,
                AddApiMethodDataError: true
            })

        // Handle Update Api Method 
        case UPDATE_API_METHOD:
            return Object.assign({}, state, {
                UpdateApiMethodData: null,
                UpdateApiMethodDataLoading: true
            })
        // Set Update Api Method Success Data
        case UPDATE_API_METHOD_SUCCESS:
            return Object.assign({}, state, {
                UpdateApiMethodData: action.payload,
                UpdateApiMethodDataLoading: false,
            })
        // Set Update Api Method Failure Data
        case UPDATE_API_METHOD_FAILURE:
            return Object.assign({}, state, {
                UpdateApiMethodData: null,
                UpdateApiMethodDataLoading: false,
                UpdateApiMethodDataError: true
            })

        // Handle Get System Rest Api method list 
        case LIST_SYSTEM_REST_METHOD:
            return Object.assign({}, state, {
                RestMethodListData: null,
                RestMethodListDataLoading: true
            })
        // Set System rest api method list success data
        case LIST_SYSTEM_REST_METHOD_SUCCESS:
            return Object.assign({}, state, {
                RestMethodListData: action.payload,
                RestMethodListDataLoading: false,
            })
        // Set System rest api method list success data 
        case LIST_SYSTEM_REST_METHOD_FAILURE:
            return Object.assign({}, state, {
                RestMethodListData: null,
                RestMethodListDataLoading: false,
                RestMethodListDataError: true
            })

        // Handle Get System Socket Api method list 
        case LIST_SOCKET_METHOD:
            return Object.assign({}, state, {
                SocketMethodListData: null,
                SocketMethodListDataLoading: true
            })
        // Set System Socket api method list success data
        case LIST_SOCKET_METHOD_SUCCESS:
            return Object.assign({}, state, {
                SocketMethodListData: action.payload,
                SocketMethodListDataLoading: false,
            })
        // Set System Socket api method list success data 
        case LIST_SOCKET_METHOD_FAILURE:
            return Object.assign({}, state, {
                SocketMethodListData: null,
                SocketMethodListDataLoading: false,
                SocketMethodListDataError: true
            })

        // Clear data
        case API_METHOD_CLEAR:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}