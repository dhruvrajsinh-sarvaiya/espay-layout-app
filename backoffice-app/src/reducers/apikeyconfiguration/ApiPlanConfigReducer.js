import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Api Plan Configuration List
    GET_API_PLAN_CONFIG_LIST,
    GET_API_PLAN_CONFIG_LIST_SUCCESS,
    GET_API_PLAN_CONFIG_LIST_FAILURE,

    // Clear Api Plan Config Data
    CLEAR_API_PLAN_CONFIG_DATA,

    // Get Rest Method Read Only
    GET_REST_METHOD_READ_ONLY,
    GET_REST_METHOD_READ_ONLY_SUCCESS,
    GET_REST_METHOD_READ_ONLY_FAILURE,

    // Get Rest Method Full Access
    GET_REST_METHOD_FULL_ACCESS,
    GET_REST_METHOD_FULL_ACCESS_SUCCESS,
    GET_REST_METHOD_FULL_ACCESS_FAILURE,

    // Add Api Plan Configuration
    ADD_API_PLAN_CONFIG,
    ADD_API_PLAN_CONFIG_SUCCESS,
    ADD_API_PLAN_CONFIG_FAILURE,

    // Update Api Plan Configuration
    UPDATE_API_PLAN_CONFIG,
    UPDATE_API_PLAN_CONFIG_SUCCESS,
    UPDATE_API_PLAN_CONFIG_FAILURE,

    // Get Currency List
    GET_CURRENCY_LIST,
    GET_CURRENCY_LIST_SUCCESS,
    GET_CURRENCY_LIST_FAILURE,
} from "../../actions/ActionTypes";

// Initial State for Get Api Plan Configuration List
const INITIAL_STATE = {

    // for Get Api Plan Configuration List
    ApiPlanConfigList: null,
    ApiPlanConfigListLoading: false,
    ApiPlanConfigListError: false,

    // for Rest Method Read Only
    RestMethodReadOnly: null,
    RestMethodReadOnlyLoading: false,
    RestMethodReadOnlyError: false,

    // for Rest Method Full Access
    RestMethodFullAccess: null,
    RestMethodFullAccessLoading: false,
    RestMethodFullAccessError: false,

    // for Add Api Plan Configuration
    AddApiPlanConfigData: null,
    AddApiPlanConfigLoading: false,
    AddApiPlanConfigError: false,

    // for Update Api Plan Configuration
    UpdateApiPlanConfigData: null,
    UpdateApiPlanConfigLoading: false,
    UpdateApiPlanConfigError: false,

    // Currency List
    CurrencyListData: null,
    CurrencyListLoading: false,
    CurrencyListError: false,
}

export default function ApiPlanConfigReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Api Plan Configuration method data
        case GET_API_PLAN_CONFIG_LIST:
            return Object.assign({}, state, {
                ApiPlanConfigList: null,
                ApiPlanConfigListLoading: true
            })
        // Set Api Plan Configuration success data
        case GET_API_PLAN_CONFIG_LIST_SUCCESS:
            return Object.assign({}, state, {
                ApiPlanConfigList: action.data,
                ApiPlanConfigListLoading: false,
            })
        // Set Api Plan Configuration failure data
        case GET_API_PLAN_CONFIG_LIST_FAILURE:
            return Object.assign({}, state, {
                ApiPlanConfigList: null,
                ApiPlanConfigListLoading: false,
                ApiPlanConfigListError: true
            })

        // Handle Rest Method Read Only method data
        case GET_REST_METHOD_READ_ONLY:
            return Object.assign({}, state, {
                RestMethodReadOnly: null,
                RestMethodReadOnlyLoading: true
            })
        // Set Rest Method Read Only success data
        case GET_REST_METHOD_READ_ONLY_SUCCESS:
            return Object.assign({}, state, {
                RestMethodReadOnly: action.data,
                RestMethodReadOnlyLoading: false,
            })
        // Set Rest Method Read Only failure data
        case GET_REST_METHOD_READ_ONLY_FAILURE:
            return Object.assign({}, state, {
                RestMethodReadOnly: null,
                RestMethodReadOnlyLoading: false,
                RestMethodReadOnlyError: true
            })

        // Handle Rest Method Full Access method data
        case GET_REST_METHOD_FULL_ACCESS:
            return Object.assign({}, state, {
                RestMethodFullAccess: null,
                RestMethodFullAccessLoading: true
            })
        // Set Rest Method Full Access success data
        case GET_REST_METHOD_FULL_ACCESS_SUCCESS:
            return Object.assign({}, state, {
                RestMethodFullAccess: action.data,
                RestMethodFullAccessLoading: false,
            })
        // Set Rest Method Full Access failure data
        case GET_REST_METHOD_FULL_ACCESS_FAILURE:
            return Object.assign({}, state, {
                RestMethodFullAccess: null,
                RestMethodFullAccessLoading: false,
                RestMethodFullAccessError: true
            })

        // Handle Add Api Plan Configuration Data method data
        case ADD_API_PLAN_CONFIG:
            return Object.assign({}, state, {
                AddApiPlanConfigData: null,
                AddApiPlanConfigLoading: true
            })
        // Set Add Api Plan Configuration Data success data
        case ADD_API_PLAN_CONFIG_SUCCESS:
            return Object.assign({}, state, {
                AddApiPlanConfigData: action.data,
                AddApiPlanConfigLoading: false,
            })
        // Set Add Api Plan Configuration Data failure data
        case ADD_API_PLAN_CONFIG_FAILURE:
            return Object.assign({}, state, {
                AddApiPlanConfigData: null,
                AddApiPlanConfigLoading: false,
                AddApiPlanConfigError: true
            })

        // Handle Add Api Plan Configuration Data method data
        case UPDATE_API_PLAN_CONFIG:
            return Object.assign({}, state, {
                UpdateApiPlanConfigData: null,
                UpdateApiPlanConfigLoading: true
            })
        // Set Add Api Plan Configuration Data success data
        case UPDATE_API_PLAN_CONFIG_SUCCESS:
            return Object.assign({}, state, {
                UpdateApiPlanConfigData: action.data,
                UpdateApiPlanConfigLoading: false,
            })
        // Set Add Api Plan Configuration Data failure data
        case UPDATE_API_PLAN_CONFIG_FAILURE:
            return Object.assign({}, state, {
                UpdateApiPlanConfigData: null,
                UpdateApiPlanConfigLoading: false,
                UpdateApiPlanConfigError: true
            })

        // Handle Add Api Plan Configuration Data method data
        case GET_CURRENCY_LIST:
            return Object.assign({}, state, {
                CurrencyListData: null,
                CurrencyListLoading: true
            })
        // Set Add Api Plan Configuration Data success data
        case GET_CURRENCY_LIST_SUCCESS:
            return Object.assign({}, state, {
                CurrencyListData: action.payload,
                CurrencyListLoading: false,
            })
        // Set Add Api Plan Configuration Data failure data
        case GET_CURRENCY_LIST_FAILURE:
            return Object.assign({}, state, {
                CurrencyListData: null,
                CurrencyListLoading: false,
                CurrencyListError: true
            })

        // Clear Api Plan Configuration method data
        case CLEAR_API_PLAN_CONFIG_DATA:
            return Object.assign({}, state, {
                ApiPlanConfigList: null,
                AddApiPlanConfigData: null,
                UpdateApiPlanConfigData: null,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}