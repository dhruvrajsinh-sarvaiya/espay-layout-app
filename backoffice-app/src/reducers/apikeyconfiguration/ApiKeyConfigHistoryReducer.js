import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Api Key Configuration History
    GET_API_KEY_CONFIG_HISTORY,
    GET_API_KEY_CONFIG_HISTORY_SUCCESS,
    GET_API_KEY_CONFIG_HISTORY_FAILURE,

    // Get User Data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    // Get Api Plan Configuration List
    GET_API_PLAN_CONFIG_LIST,
    GET_API_PLAN_CONFIG_LIST_SUCCESS,
    GET_API_PLAN_CONFIG_LIST_FAILURE,
    CLEAR_API_KEY_CONFIG_HISTORY,
} from "../../actions/ActionTypes";

// Initial State for Get Api Key Configuration History
const INITIAL_STATE = {

    // Api Key Configuration History
    ApiKeyConfigHistoryData: null,
    ApiKeyConfigHistoryLoading: false,
    ApiKeyConfigHistoryError: false,

    // for user data
    UserDataList: null,
    UserDataListLoading: false,
    UserDataListError: false,

    // for Get Api Plan Configuration List
    ApiPlanConfigList: null,
    ApiPlanConfigListLoading: false,
    ApiPlanConfigListError: false,
}

export default function ApiKeyConfigHistoryReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') 
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Api Key Configuration History method data
        case GET_API_KEY_CONFIG_HISTORY:
            return Object.assign({}, state, {
                ApiKeyConfigHistoryData: null,
                ApiKeyConfigHistoryLoading: true
            })
        // Set Api Key Configuration History success data
        case GET_API_KEY_CONFIG_HISTORY_SUCCESS:
            return Object.assign({}, state, {
                ApiKeyConfigHistoryData: action.data,
                ApiKeyConfigHistoryLoading: false,
            })
        // Set Api Key Configuration History failure data
        case GET_API_KEY_CONFIG_HISTORY_FAILURE:
            return Object.assign({}, state, {
                ApiKeyConfigHistoryData: null,
                ApiKeyConfigHistoryLoading: false,
                ApiKeyConfigHistoryError: true
            })

        // Handle Api Key Configuration History method data
        case CLEAR_API_KEY_CONFIG_HISTORY:
            return Object.assign({}, state, {
                ApiKeyConfigHistoryData: null,
            })

        // Handle Get User Data method data
        case GET_USER_DATA:
            return Object.assign({}, state, {
                UserDataList: null,
                UserDataListLoading: true
            })
        // Set Get User Data success data
        case GET_USER_DATA_SUCCESS:
            return Object.assign({}, state, {
                UserDataList: action.payload,
                UserDataListLoading: false,
            })
        // Set Get User Data failure data
        case GET_USER_DATA_FAILURE:
            return Object.assign({}, state, {
                UserDataList: null,
                UserDataListLoading: false,
                UserDataListError: true
            })

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

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}